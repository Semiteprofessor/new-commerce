import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { ReturnRequest } from '../entities/return-request.entity';

@Injectable()
export class ReturnRequestRepository extends EntityRepository<ReturnRequest> {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly _returnRequestRepository: Repository<ReturnRequest>,
  ) {
    super(_returnRequestRepository);
  }
}
