import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export abstract class EntityRepository<T> {
  constructor(protected readonly entityRepository: Repository<T>) {}

  async find(
    filterQuery: FindOptionsWhere<T>,
    options?: FindManyOptions<T>,
  ): Promise<T[] | null> {
    return this.entityRepository.find({ where: filterQuery, ...options });
  }

  async findOne(
    filterQuery: FindOptionsWhere<T>,
    options?: FindOneOptions<T>,
  ): Promise<T | null> {
    return this.entityRepository.findOne({ where: filterQuery, ...options });
  }
}
