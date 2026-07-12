import { Injectable } from '@nestjs/common';
import { Waitlist } from '../entities/waitlist.entity';
import { WaitlistDto } from '../dto/waitlist.dto';
import { WaitlistRepository } from '../repositories/waitlist.repository';

@Injectable()
export class WaitlistService {
  constructor(private readonly waitlistRepository: WaitlistRepository) {}

  async joinWaitlist(dto: WaitlistDto) {
    const existing = await this.waitlistRepository.findOne({
      email: dto.email,
    });

    if (existing) {
      return { message: 'Already on the waitlist' };
    }

    return await this.waitlistRepository.create(dto);
  }
}
