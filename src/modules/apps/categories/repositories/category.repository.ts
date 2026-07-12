import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
  ) {}
  async create(data: DeepPartial<Category>): Promise<Category> {
    try {
      const user = this._categoryRepository.create(data);
      return await this._categoryRepository.save(user);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const error = e as QueryFailedError & { code?: string };

        if (error.code === '23505') {
          throw new ConflictException({
            statusCode: 409,
            message: `A category with name, ${data.name} already exists`,
          });
        }
      }
      throw e;
    }
  }

  async findOne(
    filterQuery: FindOptionsWhere<Category>,
    options?: FindOneOptions<Category>,
  ): Promise<Category | null> {
    return this._categoryRepository.findOne({ where: filterQuery, ...options });
  }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._categoryRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
