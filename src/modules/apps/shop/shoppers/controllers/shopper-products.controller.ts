import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from '../../products/services/product.service';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../common/dtos/pagination.dto';
import { Product } from '../../products/entities/product.entity';
import { BuyNowDto } from '../../cart/dto/cart';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import { ActiveUser } from '../../../../../modules/core/iam/decorators/active-user.decorator';
import { CreateReviewDto } from '../../products/dto/review.dto';
import { AuthType } from '../../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../../modules/core/iam/authentication/decorator/auth.decorator';

@Controller('v1/shoppers/products')
export class ShopperProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Auth(AuthType.None)
  @Get('')
  async allProducts(
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productsService.getAllOpenProducts(query);
  }

  @Auth(AuthType.None)
  @Get('timeline')
  async productTimeline(
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productsService.getProductTl();
  }

  @Auth(AuthType.None)
  @Get('similar')
  async similarProducts(
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productsService.getAllOpenProducts(query);
  }

  @Auth(AuthType.None)
  @Get('/categories/:slug')
  async getAllProductsByCategory(
    @Param('slug') slug: string,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productsService.getProductsByCategory(slug, query);
  }

  @Auth(AuthType.None)
  @Get(':slug')
  async getSingleProductBySlug(
    @Param('slug') slug: string,
  ): Promise<Product | undefined> {
    console.log(slug);
    return await this.productsService.getSingleProductBySlug(slug);
  }

  @Post('buy-now')
  async buyNow(@Body() dto: BuyNowDto, @ActiveUser() actor: ActorUser) {
    return this.productsService.buyNow(dto, actor);
  }

  @Post('rate/:id')
  async rateProduct(
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
    @ActiveUser() actor: ActorUser,
  ) {
    return this.productsService.rateProduct(id, actor.id, dto);
  }
}
