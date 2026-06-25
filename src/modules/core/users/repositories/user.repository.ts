import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EntityRepository } from 'src/db/repository/entity.repository';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    super(_userRepository);
  }

  async create(data: Partial<User>): Promise<User> {
    try {
      const user = this._userRepository.create(data);
      return await this._userRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException({
          statusCode: 409,
          message: `An account, ${data.email} already exists `,
        });
      }
      throw e;
    }
  }

  async findAll(query: QueryParamsDto): Promise<PaginatedRecordsDto<User>> {
    const { startsAt, sortOrder, sortBy, page, limit, endsAt, ...rest } = query;
    const _query = this._userRepository.createQueryBuilder('users');

    Object.entries(rest).forEach(([key, value]) => {
      if (value) {
        _query.andWhere(`users.${key} = :${key}`, { [key]: value });
      }
    });

    if (startsAt && endsAt) {
      _query.andWhere(`users.createdAt BETWEEN :startsAt AND :endsAt`, {
        startsAt,
        endsAt,
      });
    }

    const totalCountQuery = _query.clone();

    _query
      .orderBy(`users.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [total, data] = await Promise.all([
      totalCountQuery.getCount(),
      _query.getMany(),
    ]);

    const pageInfo: PageInfo = {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    return { data, pageInfo };
  }
}
