import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { WaitlistService } from '../services/waitlist.service';
import { WaitlistDto } from '../dto/waitlist.dto';

@Controller('v1/shoppers/waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  joinWaitlist(@Body() dto: WaitlistDto) {
    return this.waitlistService.joinWaitlist(dto);
  }
}
