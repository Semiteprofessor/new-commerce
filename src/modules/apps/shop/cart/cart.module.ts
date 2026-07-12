import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './services/cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../../../../modules/core/users/entities/user.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ProductRepository } from '../products/repositories/product.repository';
import { OrderItemRepository } from '../order/repositories/order-item.repository';
import { OrderRepository } from '../order/repositories/order.repository';
import { CartRepository } from './repositories/cart.repository';
import { ShippingAddressRepository } from '../order/repositories/shipping-address.repository';
import { ShippingAddress } from '../order/entities/shipping-address.entity';
import { WishlistModule } from '../wishlist/wishlist.module';
import { ShippingAddressService } from '../order/services/shipping-address.service';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../products/product.module';
import { CartItemRepository } from './repositories/cart-item-repository';
import { UserModule } from '../../../../modules/core/users/user.module';
import { BusinessProfileRepository } from '../merchants/repositories/business-profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Product,
      Order,
      OrderItem,
      User,
      BusinessProfileRepository,
      ShippingAddress,
    ]),

    UserModule,
    WishlistModule,
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
  ],
  providers: [
    CartService,
    CartRepository,
    CartItemRepository,
    ProductRepository,
    OrderItemRepository,
    OrderRepository,
    ShippingAddressRepository,
    ShippingAddressService,
  ],
  exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule {}
