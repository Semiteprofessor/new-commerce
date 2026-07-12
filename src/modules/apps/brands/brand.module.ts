import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandRepository } from './repositories/brand.repository';
import { Brand } from './entities/brand.entity';
import { BrandService } from './services/brand.service';
import { BrandController } from '../brands/controllers/brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
  exports: [BrandRepository],
})
export class BrandsModule {}
