import { Injectable } from '@nestjs/common';
import { BusinessProfile } from '../entities/business-profile.entity';
import { BusinessProfileRepository } from '../repositories/business-profile.repository';

@Injectable()
export class BusinessProfileService {
  constructor(
    private readonly businessProfileRepository: BusinessProfileRepository,
  ) {}

  async businessProfile(userId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileRepository.findOne({
      owner: { id: userId },
    });
  }
}
