import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otps } from './otp.entity';
import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otps])],
  providers: [OtpRepository, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
