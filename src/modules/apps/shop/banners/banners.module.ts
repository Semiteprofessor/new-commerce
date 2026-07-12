import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileBanner } from './entities/mobile-banner.entity';
import { WebBanner } from './entities/web-banner.entity';
import { BannersController } from './controllers/banners.controller';
import { BannersService } from './services/banners.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileBanner, WebBanner])],
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
