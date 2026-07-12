import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/modules/core/iam/authentication/decorator/auth.decorator';
import { AuthType } from 'src/modules/core/iam/authentication/enums/auth-type.enum';
import { UtilsService } from '../services/utils.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Auth(AuthType.None)
  @Get('address')
  async getGoogleLocation(@Query('q') q: string): Promise<any> {
    return this.utilsService.fetchAddressSuggestions(q);
  }
}
