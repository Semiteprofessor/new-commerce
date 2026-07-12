import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../entities/sections.entity';

@Injectable()
export class SectionRepository {
  // private readonly _sectionRepository = this.dataSource.getRepository(Section);
  constructor(
    @InjectRepository(Section)
    private readonly _sectionRepository: Repository<Section>,
  ) {}
  async create(data: Partial<Section>): Promise<Section> {
    try {
      const user = this._sectionRepository.create(data);
      return await this._sectionRepository.save(user);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const error = e as QueryFailedError & { code?: string };

        if (error.code === '23505') {
          throw new ConflictException({
            statusCode: 409,
            message: `A section with name, ${data.name} already exists`,
          });
        }
      }
      throw e;
    }
  }

  async findOne(
    filterQuery: FindOptionsWhere<Section>,
    options?: FindOneOptions<Section>,
  ): Promise<Section | null> {
    return this._sectionRepository.findOne({ where: filterQuery, ...options });
  }
}
