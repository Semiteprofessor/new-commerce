import {
    DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository,
  SelectQueryBuilder,
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

  async create(createEntityData: DeepPartial<T>): Promise<T> {
    const entity = this.entityRepository.create(createEntityData);
    return await this.entityRepository.save(entity);
  }

  async insertMany(documents: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.entityRepository.create(documents);
    return await this.entityRepository.save(entities);
  }

  async findOneAndUpdate(
    filterQuery: FindOptionsWhere<T>,
    updateEntityData: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    await this.entityRepository.update(filterQuery, updateEntityData);
    return await this.findOne(filterQuery);
  }

  async deleteOne(filterQuery: FindOptionsWhere<T>): Promise<boolean> {
    const result = await this.entityRepository.delete(filterQuery);
    return result.affected > 0;
  }

  createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.entityRepository.createQueryBuilder(alias);
  }
}
