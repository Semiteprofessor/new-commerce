import { FindOptionsWhere, In, Repository } from 'typeorm';
import { EntityRepository } from 'src/db/repository/entity.repository';
import { Warranty } from '../entities/warranty.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PageInfo,
  PaginatedRecordsDto,
  QueryParamsDto,
} from 'src/modules/common/dtos/pagination.dto';

@Injectable()
export class WarrantyRepository extends EntityRepository<Warranty> {
  constructor(
    @InjectRepository(Warranty)
    private readonly _warrantyRepository: Repository<Warranty>,
  ) {
    super(_warrantyRepository);
  }

  async save(data: any) {
    const warranty = this._warrantyRepository.create(data);
    return await this._warrantyRepository.save(warranty);
  }

  async findByIds(
    ids: string[],
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    const {
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    if (!ids.length) {
      throw new BadRequestException('Warranty IDs array cannot be empty.');
    }

    const whereClause: FindOptionsWhere<Warranty> = {
      id: In(ids),
      deletedAt: null,
    };

    const [data, totalCount] = await this._warrantyRepository.findAndCount({
      where: whereClause,
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data, pageInfo };
  }
}
