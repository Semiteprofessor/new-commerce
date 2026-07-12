import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '../../../../../modules/common/enums/role.enum';
import { Roles } from '../../../../../modules/core/iam/authorization/decorators/role.decorator';
import { ActiveUser } from '../../../../../modules/core/iam/decorators/active-user.decorator';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import { Warranty } from '../entities/warranty.entity';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../../modules/common/dtos/pagination.dto';
import { ClaimDetailsDto } from '../dto/warranty.dto';
import { ThirdParty } from '../entities/third-party.entity';
import { ThirdPartyDto } from '../dto/third-party.dto';
import { WarrantyService } from '../services/warranty.service';
import { ThirdPartyService } from '../services/third-party.service';
import { AuthType } from '../../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../../modules/core/iam/authentication/decorator/auth.decorator';

@Auth(AuthType.Bearer)
@Roles(UserRole.CUSTOMER)
@Controller('v1/shoppers/warranty')
export class WarrantyController {
  constructor(
    private readonly warrantyService: WarrantyService,
    private readonly thirdPartyService: ThirdPartyService,
  ) {}

  @Get('active')
  async getActiveWarranty(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    return this.warrantyService.getActiveWarranty(actor.id, query);
  }

  @Get('claimed')
  async getClaimedWarranty(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    return this.warrantyService.getClaimedWarranty(actor.id, query);
  }

  @Get('expired')
  async getExpiredWarranty(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    return this.warrantyService.getExpiredWarranty(actor.id, query);
  }

  @Post('claim')
  async claimWarranty(
    @ActiveUser() actor: ActorUser,
    @Body() claimDto: ClaimDetailsDto,
  ): Promise<{ message: string; data: Warranty }> {
    const warranty = await this.warrantyService.claimWarranty(
      actor.id,
      claimDto,
    );
    return { message: 'Warranty claim submitted successfully', data: warranty };
  }

  @Post('transfer')
  async transferTo3rdParty(
    @ActiveUser() actor: ActorUser,
    @Body() thirdPartyDto: ThirdPartyDto,
  ): Promise<{ message: string; data: ThirdParty }> {
    const warranty = await this.thirdPartyService.transferThirdParty(
      actor.id,
      thirdPartyDto,
    );
    return { message: 'Warranty added successfully', data: warranty };
  }
}
