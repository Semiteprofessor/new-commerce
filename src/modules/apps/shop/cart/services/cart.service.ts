import { UserRepository } from '../../../../../modules/core/users/repositories/user.repository';
import { BusinessProfileRepository } from '../../merchants/repositories/business-profile.repository';
import { OrderItemRepository } from '../../order/repositories/order-item.repository';
import { OrderRepository } from '../../order/repositories/order.repository';
import { ShippingAddressRepository } from '../../order/repositories/shipping-address.repository';
import { ProductRepository } from '../../products/repositories/product.repository';
import { CartItemRepository } from '../repositories/cart-item-repository';
import { CartRepository } from '../repositories/cart.repository';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../products/services/product.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ErpnextQueueService } from '../../../../../modules/core/queue/erpnext-queue.service';
import { ConfigService } from '@nestjs/config';
import { CouponRepository } from '../../products/repositories/coupon.repository';
import { CouponService } from '../../products/services/coupon.service';
import { customAlphabet } from 'nanoid';
import { Cart } from '../entities/cart.entity';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import { UserEvents } from '../../../../../modules/common/app.events';
import { Order } from '../../order/entities/order.entity';

const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 10);

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private cartItemRepository: CartItemRepository,
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private businessProfileRepository: BusinessProfileRepository,
    private productRepository: ProductRepository,
    private shippingAddressRepository: ShippingAddressRepository,
    private couponRepository: CouponRepository,
    private userRepository: UserRepository,
    @Inject(forwardRef(() => ProductService))
    private productsService: ProductService,
    private couponService: CouponService,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpQueueService: ErpnextQueueService,
    private readonly configService: ConfigService,
  ) {}

  async getCart(user: any): Promise<Cart> {
    let cart = await this.cartRepository.findOne(
      { userId: user.id },
      {
        relations: {
          items: {
            product: { business: true, coupons: true },
          },
        },
      },
    );
    if (!cart) {
      cart = await this.cartRepository.create({ user, items: [] });
    }
    return cart;
  }

  private async calculatePrices(cart: Cart) {
    cart.itemsPrice = cart.items.reduce(
      (acc, item) =>
        acc +
        (item.discountedPrice > 0 ? item.discountedPrice : item.price) *
          item.quantity,
      0,
    );

    cart.shippingPrice = cart.shippingPrice ?? 0;
    cart.couponDiscount = cart.couponDiscount ?? 0;

    let totalPrice =
      cart.itemsPrice - cart.couponDiscount + Number(cart.shippingPrice);
    let totalDiscount = cart.items.reduce(
      (acc, item) => acc + (item.price - item.discountedPrice) * item.quantity,
      0,
    );

    totalDiscount += Number(cart.couponDiscount) ?? 0;

    await this.cartRepository.findOneAndUpdate(
      { id: cart.id },
      {
        itemsPrice: cart.itemsPrice,
        //shippingPrice: cart.shippingPrice,
        totalDiscount,
        totalPrice,
      },
    );

    return this.cartRepository.findOne(
      { id: cart.id },
      { relations: { items: { product: true } } },
    );
  }

  async addCartItem(
    productId: string,
    qty: number,
    price: number,
    discountedPrice: number,
    actorUser: ActorUser,
  ): Promise<Cart> {
    const product = await this.productsService.getSingleProductById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const cart = await this.getCart(actorUser);

    if (!cart.items) cart.items = [];

    const existingItem = cart.items.find(
      (item) => item.product.id === productId,
    );

    if (existingItem) {
      existingItem.quantity = qty;
      await this.cartItemRepository.findOneAndUpdate(
        { id: existingItem.id },
        existingItem,
      );
    } else {
      const cartItem = await this.cartItemRepository.create({
        product,
        cart,
        quantity: qty,
        price,
        discountedPrice,
      });
      cart.items.push(cartItem);
    }
    if (cart.couponApplied) {
      await this.applyCouponCode(cart.coupon.code, actorUser, true);
    } else {
      this.calculatePrices(cart);
    }
    return cart;
  }

  async removeFromCart(productId: string, actorUser: ActorUser): Promise<Cart> {
    const cart = await this.getCart(actorUser);
    const itemToRemove = cart.items.find(
      (item) => item.product.id === productId,
    );
    if (!itemToRemove) {
      throw new NotFoundException('Product not found in cart');
    }
    await this.cartItemRepository.deleteOne({ id: itemToRemove.id });
    const updatedCart = await this.getCart(actorUser);
    if (cart.couponApplied) {
      await this.applyCouponCode(cart.coupon.code, actorUser, true);
    } else {
      this.calculatePrices(updatedCart);
    }
    return updatedCart;
  }

  async checkout(
    user: ActorUser,
    shippingAddressId: string,
    paymentMethod: string,
  ): Promise<Order> {
    const cart = await this.getCart(user);
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }
    const shippingAddress = await this.shippingAddressRepository.findOne({
      id: shippingAddressId,
      user: { id: user.id },
    });
    if (!shippingAddress) {
      throw new NotFoundException(
        `Shipping address with ID ${shippingAddressId} not found or does not belong to user ${user.id}.`,
      );
    }

    const merchantOrders: Record<
      string,
      { email: string; firstName: string; products: any[] }
    > = {};
    const order = await this.orderRepository.create({
      user,
      shippingAddress,
      paymentMethod,
      items: [],
      subtotal: cart.itemsPrice,
      discount: 0,
      shippingFee: cart.shippingPrice,
      grandTotal: cart.totalPrice,
      coupon: cart.coupon ? cart.coupon : null,
    });

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (product.quantity < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.productName}`,
        );
      }

      const business = await this.businessProfileRepository.findOne({
        owner: { id: product.merchantId },
      });

      if (!business) {
        throw new NotFoundException('Business not found');
      }

      const orderItem = await this.orderItemRepository.create({
        order,
        product,
        qty: cartItem.quantity,
        price: cartItem.price,
        discountedPrice: cartItem.discountedPrice,
        merchant: product.merchant,
        merchantId: product.merchantId,
        productId: product.id,
        sellerBusinessName: business.name,
        orderItemCode: `${nanoid(8)}`.toUpperCase(),
      });

      order.items.push(orderItem);

      product.quantity -= cartItem.quantity;
      await this.productRepository.findOneAndUpdate(
        { id: product.id },
        product,
      );

      if (!merchantOrders[product.merchantId]) {
        const merchant = await this.userRepository.findOne({
          id: product.merchantId,
        });
        merchantOrders[product.merchantId] = {
          email: merchant.email,
          firstName: merchant.firstName,
          products: [],
        };
      }
      merchantOrders[product.merchantId].products.push({
        name: product.productName,
        brand: product.brand,
        image: product.images[0].url,
        quantity: cartItem.quantity,
        price:
          cartItem.discountedPrice > 0
            ? cartItem.discountedPrice
            : cartItem.price,
        orderId: orderItem.orderItemCode,
        skuNumber: product.erpSKUNumber,
        warranty: product.warranty,
        date: order.createdAt,
      });
    }

    await this.cartRepository.deleteOne({ id: cart.id });

    for (const merchantId in merchantOrders) {
      const { email, firstName, products } = merchantOrders[merchantId];

      this.eventEmitter.emit(UserEvents.SEND_ORDER_CREATED, {
        email,
        firstName,
        products,
        orderUrl: `${process.env.APP_URL}`,
      });
    }

    this.eventEmitter.emit(UserEvents.SEND_ORDER_INVOICE, {
      orderId: order.id,
      email: order.user.email,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      shippingAddress: order.shippingAddress,
      items: cart.items.map((item) => ({
        name: item.product.productName,
        price: item.discountedPrice > 0 ? item.discountedPrice : item.price,
        quantity: item.quantity,
        image: item.product.images?.[0]?.url,
      })),
      paymentMethod: order.paymentMethod,
      date: order.createdAt,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      total: order.grandTotal,
      orderUrl: `${this.configService.get('SHOPPERS_URL')}/profile/orders/${order?.id}/track`,
    });

    await this.erpQueueService.enqueueCreateErpNextOrder(order);
    return order;
  }

  async updateCartItem(
    productId: string,
    qty: number,
    actorUser: ActorUser,
  ): Promise<Cart> {
    const cart = await this.getCart(actorUser);
    const existingItem = cart.items.find(
      (item) => item.product.id === productId,
    );

    if (!existingItem) {
      throw new NotFoundException('Product not found in cart');
    }

    existingItem.quantity = qty;
    await this.cartItemRepository.findOneAndUpdate(
      { id: existingItem.id },
      { quantity: qty },
    );
    const updatedCart = await this.getCart(actorUser);
    if (cart.couponApplied) {
      await this.applyCouponCode(cart.coupon.code, actorUser, true);
    } else {
      this.calculatePrices(updatedCart);
    }
    return updatedCart;
  }

  async applyCouponCode(
    couponCode: string,
    user: ActorUser,
    isUpdate: boolean = false,
  ): Promise<Cart> {
    const cart = await this.getCart(user);
    if (!cart || (cart.items.length === 0 && !isUpdate)) {
      throw new BadRequestException('Cart is empty.');
    }

    if (cart.couponApplied && !isUpdate) {
      throw new BadRequestException('Coupon already applied');
    }

    const coupon = await this.couponService.validateCoupon(couponCode);

    let couponDiscount = 0;
    if (coupon.pricingRule.items.length > 0) {
      const applicableProducts = coupon.pricingRule.items.map(
        (p) => p.item_code,
      );
      const cartItemsApplicable = cart.items.filter((item) =>
        applicableProducts.includes(item.product.erpSKUNumber),
      );

      if (cartItemsApplicable.length === 0 && !isUpdate) {
        throw new BadRequestException(
          'Coupon is not applicable to any product in the cart.',
        );
      }

      for (const item of cartItemsApplicable) {
        let itemPrice =
          item.discountedPrice > 0 ? item.discountedPrice : item.price;
        const itemDiscount = itemPrice * (coupon.discount / 100);

        item.discountedPrice = itemPrice - itemDiscount;
        couponDiscount += itemDiscount * item.quantity;
        await this.cartItemRepository.findOneAndUpdate(
          { id: item.id },
          { discountedPrice: item.discountedPrice },
        );
      }
    }
    let updatedCart = await this.getCart(user);
    updatedCart.itemsPrice = updatedCart.items.reduce(
      (acc, item) =>
        acc +
        (item.discountedPrice > 0 ? item.discountedPrice : item.price) *
          item.quantity,
      0,
    );
    let totalPrice =
      updatedCart.itemsPrice -
      updatedCart.couponDiscount +
      Number(updatedCart.shippingPrice);
    let totalDiscount = updatedCart.items.reduce(
      (acc, item) => acc + (item.price - item.discountedPrice) * item.quantity,
      0,
    );
    totalDiscount += couponDiscount;

    await this.cartRepository.findOneAndUpdate(
      { id: cart.id },
      {
        totalPrice: totalPrice,
        couponApplied: true,
        couponDiscount,
        coupon: coupon,
        totalDiscount,
      },
    );

    await this.couponRepository.findOneAndUpdate(
      { code: couponCode },
      { usedCount: !isUpdate ? coupon.usedCount + 1 : coupon.usedCount },
    );

    return this.getCart(user);
  }
}
