import { DeepPartial, QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebBannerImage } from '../entities/web-banner.entity';

@Injectable()
export class WebBannerImageRepository {
  constructor(
    @InjectRepository(WebBannerImage)
    private readonly _webBannerImageRepository: Repository<WebBannerImage>,
  ) {}
  async create(data: DeepPartial<WebBannerImage>): Promise<WebBannerImage> {
    try {
      const user = this._webBannerImageRepository.create(data);
      return await this._webBannerImageRepository.save(user);
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        (e as QueryFailedError & { code?: string }).code === '23505'
      ) {
        throw new ConflictException({
          statusCode: 409,
          message: `A banner with name ${data.imageUrl} already exists.`,
        });
      }
      throw e;
    }
  }

  // async findOne(
  //   filterQuery: FindOptionsWhere<LandingPageBanner>,
  //   options?: FindOneOptions<LandingPageBanner>,
  // ): Promise<LandingPageBanner | null> {
  //   return this._webBannerImageRepository.findOne({ where: filterQuery, ...options });
  // }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._webBannerImageRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
