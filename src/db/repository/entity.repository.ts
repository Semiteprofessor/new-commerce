import { Repository } from 'typeorm';

export abstract class EntityRepository<T> {
  constructor(protected readonly entityRepository: Repository<T>) {}
}
