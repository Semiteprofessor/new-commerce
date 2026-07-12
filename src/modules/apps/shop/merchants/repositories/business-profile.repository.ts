import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { Product as ProductEntity } from '../../products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessProfile } from '../entities/business-profile.entity';

@Injectable()
export class BusinessProfileRepository extends EntityRepository<BusinessProfile> {
  constructor(
    @InjectRepository(BusinessProfile)
    private readonly _businessProfileRepository: Repository<BusinessProfile>,
  ) {
    super(_businessProfileRepository);
  }
}
