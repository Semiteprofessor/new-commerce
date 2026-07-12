import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from '../../products/services/product.service';
import { Roles } from '../../../../core/iam/authorization/decorators/role.decorator';
import { UserRole } from '../../../../common/enums/role.enum';
import { ActiveUser } from '../../../../core/iam/decorators/active-user.decorator';
import { CreateProductDto } from '../../products/dto/product.dto';
import { Product } from '../../products/entities/product.entity';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../common/dtos/pagination.dto';
import { ActorUser } from '../../../../common/types/user.types';

@Roles(UserRole.MERCHANT)
@Controller('v1/merchants/products')
export class MerchantProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  // @Roles(UserRole.MERCHANT)
  async createProduct(
    @ActiveUser() actor: ActorUser,
    @Body() data: CreateProductDto,
  ) {
    return await this.productService.createProduct(actor, data);
  }

  @Get('shortage')
  async getAllShortageProducts(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productService.getAllShortageProducts(query, actor.id);
  }
  @Patch('shortage/update/:productId')
  async updateShortageProduct(
    @Param('productId') productId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
    @ActiveUser() actor: ActorUser,
  ): Promise<Product> {
    return await this.productService.updateShortageProduct(
      productId,
      quantity,
      actor.id,
    );
  }

  @Get('')
  async getAllProducts(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return await this.productService.getAllProducts(query, actor.id);
  }

  @Get(':productId')
  async getSingleProductById(
    @ActiveUser() actor: ActorUser,
    @Param('productId') productId: string,
  ): Promise<Product | undefined> {
    return await this.productService.getSingleProductById(productId, actor.id);
  }

  @Get(':slug')
  async getSingleProductBySlug(
    @ActiveUser() actor: ActorUser,
    @Param('slug') slug: string,
  ): Promise<Product | undefined> {
    return await this.productService.getSingleProductBySlug(slug);
  }
}
