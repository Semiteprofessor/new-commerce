import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../modules/core/users/entities/user.entity';
import { WarrantyRepository } from './repositories/warranty.repository';
import { WarrantyService } from './services/warranty.service';
import { WarrantyController } from './controllers/warranty.controller';
import { Warranty } from './entities/warranty.entity';
import { ThirdParty } from './entities/third-party.entity';
import { ThirdPartyRepository } from './repositories/third-party.repository';
import { UserRepository } from '../../../../modules/core/users/repositories/user.repository';
import { ThirdPartyService } from './services/third-party.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Warranty, ThirdParty])],
  providers: [
    WarrantyService,
    WarrantyRepository,
    ThirdPartyRepository,
    ThirdPartyService,
    UserRepository,
  ],
  controllers: [WarrantyController],
  exports: [
    WarrantyService,
    WarrantyRepository,
    ThirdPartyService,
    ThirdPartyRepository,
    UserRepository,
  ],
})
export class WarrantyModule {}
