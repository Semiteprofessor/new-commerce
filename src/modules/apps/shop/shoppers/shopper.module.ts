import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfile } from '../merchants/entities/business-profile.entity';

import { BusinessProfileRepository } from '../merchants/repositories/business-profile.repository';
import { BusinessProfileService } from '../merchants/services/business.service';
import { ProductModule } from '../products/product.module';
import { CategoriesModule } from '../../categories/category.module';
import { ShopperProductsController } from './controllers/shopper-products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessProfile]),
    ProductModule,
    CategoriesModule,
  ],
  controllers: [ShopperProductsController],
  providers: [BusinessProfileRepository, BusinessProfileService],
  exports: [],
})
export class ShoppersModule {}
