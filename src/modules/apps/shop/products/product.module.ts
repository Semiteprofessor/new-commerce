import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product as ProductEntity } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { BrandRepository } from '../../brands/repositories/brand.repository';
import { BusinessProfile } from '../merchants/entities/business-profile.entity';
import { BusinessProfileRepository } from 'src/modules/core/users/repositories/business.repository';
import { Coupon } from './entities/coupon.entity';
import { ErpnextModule } from 'src/modules/erpnext/erpnext.module';
import { ErpNextService } from 'src/modules/erpnext/services/erpnext.service';
import { WishlistRepository } from '../wishlist/repositories/wishlist.repository';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { User } from 'src/modules/core/users/entities/user.entity';
import { ShippingAddress } from '../order/entities/shipping-address.entity';
import { UserModule } from 'src/modules/core/users/user.module';
import { OrderModule } from '../order/order.module';
import { Review } from './entities/review.entity';
import { Brand } from '../../brands/repositories/entities/brand.entity';
import { WishlistModule } from '../wishlist/wishlist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      Brand,
      BusinessProfile,
      Coupon,
      User,
      ShippingAddress,
      Review,
    ]),
    // CategoriesModule,
    WishlistModule,
    UserModule,
    // forwardRef(() => CartModule),
    // forwardRef(() => OrderModule),
  ],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
    // CouponRepository,
    // CouponService,
    // ShippingAddressRepository,
    BusinessProfileRepository,
    // ShippingAddressService,
    // ReviewRepository,
  ],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
