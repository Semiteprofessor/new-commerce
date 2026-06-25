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
}
