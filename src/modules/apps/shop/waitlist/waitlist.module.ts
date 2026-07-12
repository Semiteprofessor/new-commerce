import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waitlist } from './entities/waitlist.entity';
import { WaitlistController } from './controllers/waitlist.controller';
import { WaitlistService } from './services/waitlist.service';
import { WaitlistRepository } from './repositories/waitlist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Waitlist])],
  controllers: [WaitlistController],
  providers: [WaitlistService, WaitlistRepository],
})
export class WaitlistModule {}
