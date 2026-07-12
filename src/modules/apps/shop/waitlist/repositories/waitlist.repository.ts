import { Repository } from 'typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PageInfo,
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../../modules/common/dtos/pagination.dto';
import { Waitlist } from '../entities/waitlist.entity';

@Injectable()
export class WaitlistRepository extends EntityRepository<Waitlist> {
  constructor(
    @InjectRepository(Waitlist)
    private readonly _waitlistRepository: Repository<Waitlist>,
  ) {
    super(_waitlistRepository);
  }

  async findAllWaitlistByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Waitlist>> {
    const {
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    const waitlistQuery = this._waitlistRepository
      .createQueryBuilder('waitlist')
      .where('waitlist.deletedAt IS NULL');

    const totalCount = await waitlistQuery.clone().getCount();

    const waitlist = await waitlistQuery
      .orderBy(`waitlist.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data: waitlist, pageInfo };
  }
}
