import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../../modules/common/dtos/pagination.dto';
import { Order } from '../entities/order.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { QueueService } from '../../../../../modules/core/queue/queue.service';
import { BusinessProfileRepository } from '../../merchants/repositories/business-profile.repository';
import { UserRepository } from '../../../../../modules/core/users/repositories/user.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErpnextQueueService } from '../../../../../modules/core/queue/erpnext-queue.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SlackChannelEnums } from '../../../../../modules/notifications/enums/slack.enum';
import { customAlphabet } from 'nanoid';
import { AppEvents, UserEvents } from '../../../../../modules/common/app.events';
import { OrderStatus } from '../enums/order.enum';
import { OrderItem } from '../entities/order-item.entity';
import { BusinessProfile } from '../../merchants/entities/business-profile.entity';
import { ShippingAddress } from '../entities/shipping-address.entity';
import { User } from '../../../../../modules/core/users/entities/user.entity';
import { ReturnRequest } from '../entities/return-request.entity';
import { formatNumber } from '../../../../../modules/common/helpers/number.helper';
import { formatDate } from 'date-fns/format';
import { ErrorCodes } from '../../../../../modules/common/error-codes.enum';
import {
  confirmDeliveryDto,
  UpdateImeiDto,
  UpdateOrderDto,
} from '../dto/order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { ShippingAddressRepository } from '../repositories/shipping-address.repository';
import { ShippingAddressService } from './shipping-address.service';
const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 6);

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly shippingAddressRepository: ShippingAddressRepository,
    private readonly userRepository: UserRepository,
    private readonly businessRepository: BusinessProfileRepository,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpQueueService: ErpnextQueueService,
    private dataSource: DataSource,
  ) {}

  async getAllOrdersByUser(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Order>> {
    query.userId = userId;
    return this.orderRepository.findAllByQueryBuilder(query);
  }

  async sendSlackEvents(id: string) {
    try {
      const order = await this.orderRepository.findOne(
        {
          id,
        },
        {
          relations: {
            items: {
              product: {
                business: true,
              },
            },
            user: true,
            shippingAddress: true,
          },
          select: {
            id: true,
            subtotal: true,
            grandTotal: true,
            shipmentCode: true,
            deliveryCode: true,
            shippingFee: true,
            items: {
              id: true,
              qty: true,
              price: true,
              deliveryCode: true,
              shipmentCode: true,
              orderItemCode: true,
              product: {
                id: true,
                productName: true,
                actual_price: true,
                discounted_price: true,
                erpSKUNumber: true,
                images: true,
                slug: true,
                business: {
                  name: true,
                  address: true,
                  phone: true,
                },
              },
            },
            user: {
              id: true,
              email: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
            shippingAddress: {
              id: true,
              address: true,
              lga: true,
              state: true,
            },
          },
        },
      );

      const blocks = this.buildSlackNotificationOrderMessage(order);

      await this.queueService.enqueueSlackNotificationForOrders({
        blocks,
        channel: SlackChannelEnums.ORDERS,
      });
      return order;
    } catch (e) {
      console.log(e);
    }
  }

  @OnEvent(AppEvents.ORDER_PAYMENT_PROCESSED, { async: true })
  async processOrderAfterPayment(data: {
    orderId: string;
    transactionId: string;
  }) {
    const { orderId } = data;
    // update order items to processing
    const orderItems = await this.orderItemRepository.find({
      order: { id: orderId },
    });
    await Promise.all(
      orderItems.map(async (item) => {
        item.deliveryCode = nanoid();
        item.shipmentCode = nanoid(8);
        item.status = OrderStatus.PROCESSING;
        return this.orderItemRepository.findOneAndUpdate(
          { id: item.id },
          {
            deliveryCode: nanoid(6),
            shipmentCode: nanoid(6),
            status: OrderStatus.PROCESSING,
          },
        );
      }),
    );

    await this.sendSlackEvents(orderId);
  }

  async getAllOrdersForMerchant(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<OrderItem>> {
    query.userId = userId;

    // if (query.orderStatus) {
    //   const orders = await this.orderRepository.find({
    //    user: { id: userId }, orderStatus: query.orderStatus
    //   });

    //   query.orderIds = orders.map(order => order.id);
    // }
    return this.orderItemRepository.findAllByQueryBuilder(query);
  }

  async getSingleOrder(userId: string, id: string): Promise<Order> {
    await this.orderBelongsToCustomer(userId, id);
    return await this.orderRepository.findOne(
      { id },
      { relations: { items: { product: true }, shippingAddress: true } },
    );
  }

  async getSingleOrderForMerchant(userId: string, id: string): Promise<Order> {
    const isMerchantInvolved = await this.orderBelongsToMerchant(userId, id);
    if (!isMerchantInvolved) {
      throw new ForbiddenException(
        'You are not authorized to access this order.',
      );
    }
    return await this.orderRepository.findOne(
      { id },
      { relations: { items: { product: true }, shippingAddress: true } },
    );
  }

  async addImeiNumber(
    orderItemId: string,
    dto: UpdateImeiDto,
    userId: string,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne(
      {
        id: orderItemId,
        merchantId: userId,
        shipmentCode: dto.shipmentCode,
      },
      { relations: { product: true, order: true } },
    );
    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found or with shipment code: ${dto.shipmentCode} or does not belong to user ${userId}.`,
      );
    }
    if (orderItem.product.hasWarranty && !dto.imeiNumber) {
      throw new NotFoundException(
        `please provide the imeiNumber to create this shipment ${userId}.`,
      );
    }

    if (!(orderItem.status === OrderStatus.PROCESSING)) {
      throw new BadRequestException(
        'You can only ship items in processing state',
      );
    }

    const updated = await this.orderItemRepository.findOneAndUpdate(
      { id: orderItemId },
      {
        imeiNumber: dto.imeiNumber,
        status: OrderStatus.SHIPPED,
        shipmentCode: dto.shipmentCode,
      },
    );
    const orderItemsByOrder = await this.orderItemRepository.find({
      order: { id: orderItem.order.id },
    });

    const shippedItems = orderItemsByOrder.filter(
      (item) => item.status === OrderStatus.SHIPPED,
    );

    if (shippedItems.length === orderItemsByOrder.length) {
      await this.orderRepository.update(orderItem.order.id, {
        orderStatus: OrderStatus.SHIPPED,
      });
    }
    return updated;
  }

  async updateOrder(
    orderId: string,
    updateAttrs: UpdateOrderDto,
    userId: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      id: orderId,
      user: { id: userId },
    });
    if (!order) {
      throw new NotFoundException(
        `Order with ID ${orderId} not found or does not belong to user ${userId}.`,
      );
    }
    const { shippingAddressId, paymentMethod } = updateAttrs;
    const shippingAddress = await this.shippingAddressRepository.findOne({
      id: shippingAddressId,
      user: { id: userId },
    });
    if (!shippingAddress) {
      throw new NotFoundException(
        `Shipping address with ID ${shippingAddressId} not found or does not belong to user ${userId}.`,
      );
    }
    return await this.orderRepository.findOneAndUpdate(
      { id: orderId },
      {
        shippingAddress,
        paymentMethod,
      },
    );
  }

  private async orderBelongsToCustomer(
    userId: string,
    orderId: string,
  ): Promise<boolean> {
    const order = await this.orderRepository.findOne(
      { id: orderId, deletedAt: null },
      { relations: { user: true } },
    );
    if (!order) {
      throw new NotFoundException({
        errorCode: ErrorCodes.ORDER_NOT_FOUND,
        message: 'Order not found',
      });
    }
    return order.user.id !== userId;
  }

  private async orderBelongsToMerchant(
    merchantId: string,
    orderId: string,
  ): Promise<boolean> {
    const order = await this.orderRepository.findOne(
      { id: orderId, deletedAt: null },
      { relations: { items: { merchant: true } } },
    );

    if (!order) {
      throw new NotFoundException({
        errorCode: ErrorCodes.ORDER_NOT_FOUND,
        message: 'Order not found',
      });
    }

    return order.items.some(
      (orderItem) => orderItem.merchant?.id === merchantId,
    );
  }

  private buildSlackNotificationOrderMessage(order: Order) {
    const { items, user, shippingAddress } = order;
    let blocks: any = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🔔 ${user.firstName} just made an order on 3xg`,
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Order Details*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Order Number:*
#ORD-${order.id}`,
          },
          {
            type: 'mrkdwn',
            text: `*Order Date:*
${formatDate(order.createdAt, 'MMMM Mo yyy')}`,
          },
        ],
      },
    ];

    items.map((item) => {
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${this.configService.get('SHOPPERS_URL')}/product/${item.product.slug}|${item.product.productName}>*\n*Quantity:* ${item.qty}\n*Price:* ₦${formatNumber(item.price)}\n*Merchant:* ${item.product.business.name}\n*Contact:* ${item.product.business.phone}\n*Shipping Code*: ${item.shipmentCode}\n *Delivery Code*:  ${item.deliveryCode}`,
          },
          accessory: {
            type: 'image',
            image_url: `${item.product.images[0].url}`,
            alt_text: `${item.product.productName}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url:
                'https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png',
              alt_text: 'Location Pin Icon',
            },
            {
              type: 'plain_text',
              emoji: true,
              text: `Address: *${item.product.business.address}*`,
            },
          ],
        },
      );
    });

    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Subtotal:*
₦${formatNumber(order.subtotal)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Shipping:*
₦${formatNumber(order.shippingFee)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Total:*
 ₦${formatNumber(order.grandTotal)}`,
        },
      ],
    });

    //  Customer Information
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Customer Information*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*
${user.firstName} ${user.lastName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Phone:*
${user.phone}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*
${user.email}`,
          },
          {
            type: 'mrkdwn',
            text: '*Payment:*\nPaystack',
          },
        ],
      },
    );

    // shippment information
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '📍 *Shippment Information*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Address:*
${shippingAddress.address} (${shippingAddress.longitude}, ${shippingAddress.latitude})`,
          },
          {
            type: 'mrkdwn',
            text: `*lga:*
${shippingAddress.lga}`,
          },
          {
            type: 'mrkdwn',
            text: `*State:*
${shippingAddress.state}`,
          },
          {
            type: 'mrkdwn',
            text: `*PostalCode:*
${shippingAddress.postalCode}`,
          },
        ],
      },
    );

    return blocks;
  }

  async getOrderItemByImei(imei: string): Promise<OrderItem> {
    return this.orderItemRepository.findOne(
      { imeiNumber: imei },
      { relations: { product: true, order: { user: true } } },
    );
  }

  async confirmDelivery(
    orderItemId: string,
    dto: confirmDeliveryDto,
    userId: string,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne(
      {
        id: orderItemId,
        deliveryCode: dto.deliveryCode,
      },
      { relations: { order: true } },
    );
    if (!orderItem) {
      throw new NotFoundException(
        `OrderItem with ID ${orderItemId} or deliveryCode:${dto.deliveryCode} not found or does not belong to user ${userId}.`,
      );
    }
    if (!(orderItem.status === OrderStatus.SHIPPED)) {
      throw new BadRequestException(
        'You cannot confirm delivery of item that has not been shipped',
      );
    }

    const updated = await this.orderItemRepository.findOneAndUpdate(
      { id: orderItemId },
      {
        status: OrderStatus.DELIVERED,
      },
    );
    const orderItemsByOrder = await this.orderItemRepository.find({
      order: { id: orderItem.order.id },
    });

    const deliveredItems = orderItemsByOrder.filter(
      (item) => item.status === OrderStatus.DELIVERED,
    );

    if (deliveredItems.length === orderItemsByOrder.length) {
      await this.orderRepository.update(orderItem.order.id, {
        orderStatus: OrderStatus.DELIVERED,
        deliveredAt: new Date(),
      });
    }

    return updated;
  }

  async createOrderForReplacedItem(
    orderItemId: string,
    returnRequest: ReturnRequest,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderItem = await queryRunner.manager.findOne(OrderItem, {
        where: { id: orderItemId },
        relations: { product: true, order: true },
      });
      if (!orderItem) {
        throw new NotFoundException('Product not found');
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: returnRequest.user.id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const product = orderItem.product;

      const shippingAddress = queryRunner.manager.create(ShippingAddress, {
        latitude: returnRequest.address.lat,
        longitude: returnRequest.address.long,
        firstName: user.firstName,
        lastName: user.lastName,
        phone1: user.phone,
        user: user,
        address: returnRequest.address.address,
        lga: '',
        isDefault: false,
      });
      await queryRunner.manager.save(shippingAddress);

      const business = await queryRunner.manager.findOne(BusinessProfile, {
        where: { owner: { id: product.merchantId } },
      });
      if (!business) {
        throw new NotFoundException(
          `Business not found for merchantId: ${product.merchantId}`,
        );
      }

      const price =
        product.discounted_price > 0
          ? product.discounted_price
          : product.actual_price;
      const itemsPrice = price * returnRequest.quantity;

      const shippingResponse =
        await this.shippingAddressService.calculateShippingFeeWithoutCart(
          user,
          {
            latitude: returnRequest.address.lat,
            longitude: returnRequest.address.long,
            address: returnRequest.address.address,
          },
          product.merchantId,
          returnRequest.quantity,
        );
      const shippingFee = shippingResponse ? shippingResponse.shippingFee : 0;

      const order = queryRunner.manager.create(Order, {
        user: user,
        shippingAddress: shippingAddress,
        paymentMethod: orderItem.order.paymentMethod,
        items: [],
        subtotal: itemsPrice,
        discount: 0,
        shippingFee: shippingFee,
        orderStatus: OrderStatus.PROCESSING,
        deliveryCode: nanoid(),
        shipmentCode: nanoid(),
        grandTotal: Number(itemsPrice) + Number(shippingFee),
      });
      await queryRunner.manager.save(order);

      const newOrderItem = queryRunner.manager.create(OrderItem, {
        order: order,
        product: product,
        qty: returnRequest.quantity,
        price: product.actual_price,
        discountedPrice: product.discounted_price,
        merchant: product.merchant,
        merchantId: product.merchantId,
        productId: product.id,
        sellerBusinessName: business.name,
        orderItemCode: `${nanoid(8)}`.toUpperCase(),
      });
      await queryRunner.manager.save(newOrderItem);

      order.items.push(newOrderItem);
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      const merchant = await this.userRepository.findOne({
        id: product.merchantId,
      });
      this.eventEmitter.emit(UserEvents.SEND_ORDER_CREATED, {
        email: merchant.email,
        firstName: merchant.firstName,
        products: [
          {
            name: product.productName,
            price,
            quantity: product.quantity,
            image: product.images?.[0]?.url,
            warranty: product.warranty,
            skuNumber: product.erpSKUNumber,
            orderId: order.id,
            date: order.createdAt,
          },
        ],
        orderUrl: `${process.env.APP_URL}`,
      });

      this.eventEmitter.emit(UserEvents.SEND_RETURN_REQUEST_OUTCOME_MAIL, {
        orderItemId: returnRequest.orderItem.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          name: item.product.productName,
          price: item.discountedPrice > 0 ? item.discountedPrice : item.price,
          quantity: returnRequest.quantity,
          image: item.product.images?.[0]?.url,
        })),
        code: returnRequest.code,
        isApproved:
          returnRequest.status.toLowerCase() == 'approved' ? true : false,
        isRefund:
          returnRequest.decision.toLowerCase() == 'refund' ? true : false,
        decision: returnRequest.decision,
        status: returnRequest.status,
        comment: returnRequest.adminComment,
      });

      await this.sendSlackEvents(order.id);
      await this.erpQueueService.enqueueCreateErpNextOrder(order);

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
