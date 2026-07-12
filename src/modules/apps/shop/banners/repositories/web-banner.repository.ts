import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebBanner } from '../entities/web-banner.entity';

@Injectable()
export class WebBannerRepository {
  constructor(
    @InjectRepository(WebBanner)
    private readonly _webBannerRepository: Repository<WebBanner>,
  ) {}
  async create(data: DeepPartial<WebBanner>): Promise<WebBanner> {
    try {
      const user = this._webBannerRepository.create(data);
      return await this._webBannerRepository.save(user);
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
    filterQuery: FindOptionsWhere<WebBanner>,
    options?: FindOneOptions<WebBanner>,
  ): Promise<WebBanner | null> {
    return this._webBannerRepository.findOne({ where: filterQuery, ...options });
  }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._webBannerRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
