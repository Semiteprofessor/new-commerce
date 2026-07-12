import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product as ProductEntity } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { BrandRepository } from '../../brands/repositories/brand.repository';
import { BusinessProfile } from '../merchants/entities/business-profile.entity';
<<<<<<< HEAD
import { Coupon } from './entities/coupon.entity';
import { ErpnextModule } from '../../../../modules/erpnext/erpnext.module';
import { ErpNextService } from '../../../../modules/erpnext/services/erpnext.service';
import { WishlistRepository } from '../wishlist/repositories/wishlist.repository';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { UserRepository } from '../../../../modules/core/users/repositories/user.repository';
import { User } from '../../../../modules/core/users/entities/user.entity';
import { ShippingAddress } from '../order/entities/shipping-address.entity';
import { UserModule } from '../../../../modules/core/users/user.module';
import { OrderModule } from '../order/order.module';
import { Review } from './entities/review.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { WishlistModule } from '../wishlist/wishlist.module';
import { CategoriesModule } from '../../categories/category.module';
import { CouponRepository } from './repositories/coupon.repository';
import { CouponService } from './services/coupon.service';
import { ShippingAddressRepository } from '../order/repositories/shipping-address.repository';
import { ShippingAddressService } from '../order/services/shipping-address.service';
import { ReviewRepository } from './repositories/review.repository';
import { CartModule } from '../cart/cart.module';
import { BusinessProfileRepository } from '../merchants/repositories/business-profile.repository';
=======
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
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2

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
<<<<<<< HEAD
    CategoriesModule,
    WishlistModule,
    UserModule,
    forwardRef(() => CartModule),
    forwardRef(() => OrderModule),
=======
    // CategoriesModule,
    WishlistModule,
    UserModule,
    // forwardRef(() => CartModule),
    // forwardRef(() => OrderModule),
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
  ],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
<<<<<<< HEAD
    CouponRepository,
    CouponService,
    ShippingAddressRepository,
    BusinessProfileRepository,
    ShippingAddressService,
    ReviewRepository,
  ],
  exports: [ProductService, ProductRepository, CouponRepository, CouponService],
=======
    // CouponRepository,
    // CouponService,
    // ShippingAddressRepository,
    BusinessProfileRepository,
    // ShippingAddressService,
    // ReviewRepository,
  ],
  exports: [ProductService, ProductRepository],
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
})
export class ProductModule {}
