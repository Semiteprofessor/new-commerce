import { Injectable } from '@nestjs/common';
import { MobileBanner } from '../entities/mobile-banner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WebBanner } from '../entities/web-banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(MobileBanner)
    private readonly mobileBannerRepository: Repository<MobileBanner>,
    @InjectRepository(WebBanner)
    private readonly webBannerRepository: Repository<WebBanner>,
  ) {}

  async getAllMobileBanners(): Promise<MobileBanner[]> {
    return this.mobileBannerRepository.find({ relations: { images: true } });
  }
  async getAllWebBanners(): Promise<WebBanner[]> {
    return this.webBannerRepository.find({ relations: { images: true } });
  }
}
