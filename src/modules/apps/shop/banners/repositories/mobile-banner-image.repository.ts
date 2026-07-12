import { DeepPartial, QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MobileBannerImage } from '../entities/mobile-banner.entity';

@Injectable()
export class MobileBannerImageRepository {
  constructor(
    @InjectRepository(MobileBannerImage)
    private readonly _mobilebannerImageRepository: Repository<MobileBannerImage>,
  ) {}
  async create(data: DeepPartial<MobileBannerImage>): Promise<MobileBannerImage> {
    try {
      const user = this._mobilebannerImageRepository.create(data);
      return await this._mobilebannerImageRepository.save(user);
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
  //   return this._mobilebannerImageRepository.findOne({ where: filterQuery, ...options });
  // }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._mobilebannerImageRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
