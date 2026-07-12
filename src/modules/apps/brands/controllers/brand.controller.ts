import { Controller, Get } from '@nestjs/common';
import { Auth } from '../../../../modules/core/iam/authentication/decorator/auth.decorator';
import { AuthType } from '../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Brand } from '../entities/brand.entity';
import { BrandService } from '../services/brand.service';

@Auth(AuthType.None)
@Controller('v1/merchants/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('')
  async getAllBrands(): Promise<Brand[]> {
    return await this.brandService.getBrands();
  }
}
