import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../../modules/apps/categories/entities/sections.entity';
import { Category } from '../../modules/apps/categories/entities/category.entity';

import { TypeOrmConfigModule } from '../../modules/config/typeorm-config.module';
import { Brand } from '../../modules/apps/brands/entities/brand.entity';
import {
  MobileBanner,
  MobileBannerImage,
} from '../../modules/apps/shop/banners/entities/mobile-banner.entity';
import {
  WebBanner,
  WebBannerImage,
} from '../../modules/apps/shop/banners/entities/web-banner.entity';
import { SystemWallet } from '../../modules/apps/wallet/entities/system-wallets.entity';
import { SeederService } from './seeder.service';
@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      Section,
      Category,
      Brand,
      MobileBanner,
      WebBanner,
      MobileBannerImage,
      WebBannerImage,
      SystemWallet,
    ]),
  ],
  providers: [SeederService],
  exports: [],
})
export class SeederModule {}
