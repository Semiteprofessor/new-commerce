import { Module } from '@nestjs/common';
import { BusinessProfileRepository } from './repositories/business-profile.repository';
import { BusinessProfileService } from './services/business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfile } from './entities/business-profile.entity';
import { OrderModule } from '../order/order.module';
import { Product } from '../products/entities/product.entity';
import { ProductModule } from '../products/product.module';
import { MerchantController } from './controllers/merchants.controller';
import { MerchantOrdersController } from './controllers/merchant-orders.controller';
import { MerchantProductsController } from './controllers/merchant-products.controller';
import { CategoriesModule } from '../../categories/category.module';
// import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessProfile, Product]),
    ProductModule,
    CategoriesModule,
    OrderModule,
  ],
  controllers: [
    MerchantController,
    MerchantProductsController,
    MerchantOrdersController,
  ],
  providers: [BusinessProfileRepository, BusinessProfileService],
  exports: [],
})
export class MerchantsModule {}
