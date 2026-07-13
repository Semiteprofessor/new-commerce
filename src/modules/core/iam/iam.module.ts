import { Module } from '@nestjs/common';
import { BcryptService } from './authentication/services/bcrypt.service';
import { HashingService } from './authentication/services/hashing.service';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { UserModule } from '../users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './authentication/controllers/auth.controller';
import { AuthService } from './authentication/services/auth.service';
import { GoogleStrategy } from './authentication/strategies/google.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { BusinessProfileRepository } from 'src/modules/apps/shop/merchants/repositories/business-profile.repository';
import { OtpModule } from '../otp/otp.module';
import { MerchantsModule } from 'src/modules/apps/shop/merchants/merchants.module';
import { RoleGuard } from './authorization/guards/guards/role.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([User, BusinessProfile]),
    UserModule,
    OtpModule,
    MerchantsModule,
  ],
  providers: [
    GoogleStrategy,
    { provide: HashingService, useClass: BcryptService },
    {
      // all endpoints become protected with this global guard
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    { provide: APP_GUARD, useClass: RoleGuard },
    AccessTokenGuard,
    AuthService,
    RefreshTokenIdsStorage,
    UserRepository,
    BusinessProfileRepository,
  ],
  controllers: [AuthController],
})
export class IamModule {}
