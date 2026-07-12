import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MobileBanner } from '../entities/mobile-banner.entity';

@Injectable()
export class MobileBannerRepository {
  constructor(
    @InjectRepository(MobileBanner)
    private readonly _mobileBannerRepository: Repository<MobileBanner>,
  ) {}
  async create(data: DeepPartial<MobileBanner>): Promise<MobileBanner> {
    try {
      const user = this._mobileBannerRepository.create(data);
      return await this._mobileBannerRepository.save(user);
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        (e as QueryFailedError & { code?: string }).code === '23505'
      ) {
        throw new ConflictException({
          statusCode: 409,
          message: `A banner with name ${data.name} already exists.`,
        });
      }
      throw e;
    }
  }

  async findOne(
    filterQuery: FindOptionsWhere<MobileBanner>,
    options?: FindOneOptions<MobileBanner>,
  ): Promise<MobileBanner | null> {
    return this._mobileBannerRepository.findOne({ where: filterQuery, ...options });
  }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._mobileBannerRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
