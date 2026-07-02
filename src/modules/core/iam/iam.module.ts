import { Module } from '@nestjs/common';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { UserModule } from '../users/user.module';
import { BusinessProfileRepository } from '../users/repositories/business.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([User, BusinessProfile]),
    UserModule,
  ],
  providers: [BusinessProfileRepository],
  controllers: [],
})
export class IamModule {}
