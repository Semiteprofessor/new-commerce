import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { EntityRepository } from 'src/db/repository/entity.repository';

@Injectable()
export class BusinessProfileRepository extends EntityRepository<BusinessProfile> {
  constructor(
    @InjectRepository(BusinessProfile)
    private readonly businessProfileRepository: Repository<BusinessProfile>,
  ) {
    super(businessProfileRepository);
  }
}
