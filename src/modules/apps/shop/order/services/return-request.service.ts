import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { formatNumber } from '../../../../../modules/common/helpers/number.helper';
import { SlackChannelEnums } from '../../../../../modules/notifications/enums/slack.enum';
import { ReturnRequest } from '../entities/return-request.entity';
import { AppEvents } from '../../../../../modules/common/app.events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ReturnRequestRepository } from '../repositories/return-request.repository';
import { WalletRepository } from '../../../../../modules/apps/wallet/repositories/wallet.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderRepository } from '../repositories/order.repository';
import { UserRepository } from '../../../../../modules/core/users/repositories/user.repository';
import { QueueService } from '../../../../../modules/core/queue/queue.service';
import { ConfigService } from '@nestjs/config';
import { ErpnextQueueService } from '../../../../../modules/core/queue/erpnext-queue.service';
import { OrdersService } from './order.service';
import { SubmitReturnRequestDto } from '../../../../../modules/core/iam/authentication/dtos/return-request.dto';
import { ActorUser } from '../../../../../modules/common/types/user.types';

@Injectable()
export class ReturnRequestService {
  constructor(
    private readonly returnRequestRepository: ReturnRequestRepository,
    private readonly walletRepository: WalletRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    private readonly erpQueueService: ErpnextQueueService,
    private readonly orderService: OrdersService,
  ) {}

  async submitReturnRequest(
    dto: SubmitReturnRequestDto,
    actor: ActorUser,
  ): Promise<ReturnRequest> {
    const orderItem = await this.orderItemRepository.findOne(
      { id: dto.orderItemId },
      { relations: { order: true } },
    );
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    const deliveredAt = orderItem.order?.deliveredAt;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (deliveredAt && new Date(deliveredAt) < sevenDaysAgo) {
      throw new BadRequestException(
        'You can only return item not more than 7 days after delivery',
      );
    }

    const existingReturnRequest = await this.returnRequestRepository.findOne({
      orderItem: { id: dto.orderItemId },
    });
    if (existingReturnRequest) {
      throw new BadRequestException(
        'A request has already been submitted for this order item',
      );
    }

    const user = await this.userRepository.findOne({ id: actor.id });

    if (dto.quantity > orderItem.qty) {
      throw new BadRequestException(
        'Requested quantity exceeds ordered quantity',
      );
    }

    const returnRequest = await this.returnRequestRepository.create({
      orderItem,
      user,
      reason: dto.reason,
      quantity: dto.quantity,
      media: dto.media || [],
      address: dto.address,
      receipt: dto.receipt,
      comment: dto.comment,
      code: `RET-${nanoid(10)}`.toUpperCase(),
    });

    await this.erpQueueService.enqueueSubmitErpNextReturnRequest(returnRequest);

    return returnRequest;
  }

  async getReturnRequest(id: string) {
    const returnRequest = await this.returnRequestRepository.findOne(
      { id },
      { relations: { orderItem: { order: true, product: true } } },
    );
    if (!returnRequest) {
      throw new NotFoundException('Return Request not found');
    }
    return returnRequest;
  }

  async updateReturnRequestStatus(data: any) {
    const { id, decision, comment, status } = data;
    const returnRequest = await this.returnRequestRepository.findOne(
      { id },
      { relations: { orderItem: { product: true }, user: true } },
    );
    returnRequest.decision = decision;
    returnRequest.comment = comment;
    returnRequest.status = status;
    if (!returnRequest) {
      throw new NotFoundException('Return Request not found');
    }
    const product = returnRequest.orderItem.product;

    if (
      decision &&
      status &&
      status.toLowerCase() == 'approved' &&
      decision.toLowerCase() == 'replace'
    ) {
      await this.orderService.createOrderForReplacedItem(
        returnRequest.orderItem.id,
        returnRequest,
      );
    } else if (
      decision &&
      status &&
      status.toLowerCase() == 'approved' &&
      decision.toLowerCase() == 'refund'
    ) {
      const productPrice =
        product.discounted_price > 0
          ? product.discounted_price
          : product.actual_price;
      const wallet = await this.walletRepository.findOne({
        userId: returnRequest.user.id,
      });
      wallet.balance += productPrice * returnRequest.quantity;
      await this.walletRepository.findOneAndUpdate({ id: wallet.id }, wallet);
    }
    await this.returnRequestRepository.findOneAndUpdate(
      { id: returnRequest.id },
      returnRequest,
    );
  }

  async getReturnRequestByCode(code: string) {
    const returnRequest = await this.returnRequestRepository.findOne(
      { code },
      { relations: { orderItem: { order: true, product: true } } },
    );
    if (!returnRequest) {
      throw new NotFoundException('Return Request not found');
    }
    return ReturnRequest;
  }

  async sendSlackReturnEvents(id: string) {
    const returnRequest = await this.returnRequestRepository.findOne(
      {
        id,
      },
      {
        relations: {
          orderItem: {
            product: {
              business: true,
            },
          },
          user: true,
        },
        select: {
          id: true,
          reason: true,
          quantity: true,
          media: true,
          address: {
            address: true,
          },
          receipt: true,
          comment: true,
          code: true,
          orderItem: {
            id: true,
            qty: true,
            price: true,
            orderItemCode: true,
            product: {
              id: true,
              productName: true,
              images: true,
              slug: true,
              business: {
                name: true,
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
        },
      },
    );

    const blocks = this.buildSlackNotificationReturnMessage(returnRequest);

    await this.queueService.enqueueSlackNotificationForOrders({
      blocks,
      channel: SlackChannelEnums.RETURN_REQUESTS,
    });
    return returnRequest;
  }

  @OnEvent(AppEvents.RETURN_REQUEST_SUBMITTED, { async: true })
  async processReturnRequest(data: { returnRequestId: string }) {
    const { returnRequestId } = data;
    await this.sendSlackReturnEvents(returnRequestId);
  }

  private buildSlackNotificationReturnMessage(returnRequest: ReturnRequest) {
    const { orderItem, user } = returnRequest;
    let blocks: any = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🔔 ${user.firstName} has submitted a return request`,
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
          text: '*Return Request Details*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Return Code:*
    #${returnRequest.code}`,
          },
          {
            type: 'mrkdwn',
            text: `*Reason:*
    ${returnRequest.reason}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Product:* <${orderItem.product.productName}>\n*Quantity:* ${returnRequest.quantity}\n*Price:* ₦${formatNumber(orderItem.price)}\n*Merchant:* ${orderItem.product.business.name}\n*Contact:* ${orderItem.product.business.phone}`,
        },
        accessory: {
          type: 'image',
          image_url: `${orderItem.product.images[0].url}`,
          alt_text: `${orderItem.product.productName}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Receipt:* ${returnRequest.receipt ? 'Provided' : 'Not Provided'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Additional Comments:* ${returnRequest.comment || 'None'}`,
          },
        ],
      },
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
        ],
      },
    ];

    return blocks;
  }
}
