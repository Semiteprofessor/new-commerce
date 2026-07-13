import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './app.config';
import { Section } from '../apps/categories/entities/sections.entity';
import { Category } from '../apps/categories/entities/category.entity';
import { Product } from '../apps/shop/products/entities/product.entity';
import { User } from '../core/users/entities/user.entity';
import { BusinessProfile } from '../apps/shop/merchants/entities/business-profile.entity';
import { Cart } from '../apps/shop/cart/entities/cart.entity';
import { CartItem } from '../apps/shop/cart/entities/cart-item.entity';
import { Brand } from '../apps/brands/entities/brand.entity';
import { Order } from '../apps/shop/order/entities/order.entity';
import { OrderItem } from '../apps/shop/order/entities/order-item.entity';
import {
  MobileBanner,
  MobileBannerImage,
} from '../apps/shop/banners/entities/mobile-banner.entity';
import {
  WebBanner,
  WebBannerImage,
} from '../apps/shop/banners/entities/web-banner.entity';
import { Wishlist } from '../apps/shop/wishlist/entities/wishlist.entity';
import { ShippingAddress } from '../apps/shop/order/entities/shipping-address.entity';
import { Coupon } from '../apps/shop/products/entities/coupon.entity';
import { Warranty } from '../apps/shop/warranty/entities/warranty.entity';
import { SystemWallet } from '../apps/wallet/entities/system-wallets.entity';
import { ReturnRequest } from '../apps/shop/order/entities/return-request.entity';
import { Review } from '../apps/shop/products/entities/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          ...dbConfig,
          entities: [
            Section,
            Category,
            Product,
            User, 
            BusinessProfile,
            Brand,
            Cart,
            CartItem,
            Order,
            OrderItem,
            Review,
            WebBanner,
            Wishlist,
            MobileBanner,
            WebBannerImage,
            MobileBannerImage,
            ShippingAddress,
            Coupon,
            Warranty,
            ReturnRequest,
            SystemWallet,
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
