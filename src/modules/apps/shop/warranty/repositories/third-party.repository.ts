import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThirdParty } from '../entities/third-party.entity';

@Injectable()
export class ThirdPartyRepository extends Repository<ThirdParty> {
  constructor(
    @InjectRepository(ThirdParty)
    private readonly repository: Repository<ThirdParty>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async save(data: any) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
}
