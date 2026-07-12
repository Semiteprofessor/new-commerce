import { Controller, Get } from '@nestjs/common';
import { MobileBanner } from '../entities/mobile-banner.entity';
import { WebBanner } from '../entities/web-banner.entity';
import { BannersService } from '../services/banners.service';
import { AuthType } from '../../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../../modules/core/iam/authentication/decorator/auth.decorator';
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get('mobile/all')
  @Auth(AuthType.None)
  findAllMobile(): Promise<MobileBanner[]> {
    return this.bannersService.getAllMobileBanners();
  }

  @Get('web/all')
  @Auth(AuthType.None)
  findAllWeb(): Promise<WebBanner[]> {
    return this.bannersService.getAllWebBanners();
  }
}
