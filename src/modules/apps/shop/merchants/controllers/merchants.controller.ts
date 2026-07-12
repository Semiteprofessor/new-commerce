import { Body, Controller, Get } from '@nestjs/common';
import { ActiveUser } from '../../../../core/iam/decorators/active-user.decorator';
import { BusinessProfileService } from '../services/business.service';
import { AuthType } from '../../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../../modules/core/iam/authentication/decorator/auth.decorator';

// @Auth(AuthType.None)
@Controller('v1/merchants')
export class MerchantController {
  constructor(
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  @Auth(AuthType.Bearer)
  @Get('business-profile')
  async getMerchantBusinessProfile(@ActiveUser() user: any) {
    return this.businessProfileService.businessProfile(user.id);
  }
}
