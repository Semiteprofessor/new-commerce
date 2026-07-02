import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';
import { Wishlist } from '../entities/wishlist.entity';
import { ActiveUser } from 'src/modules/core/iam/decorators/active-user.decorator';
import { ActorUser } from 'src/modules/common/types/user.types';
import { PaginatedRecordsDto, QueryParamsDto } from 'src/modules/common/dtos/pagination.dto';
import { Product } from '../../products/entities/product.entity';

@Controller('v1/shoppers/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('')
  async addWishlist(
    @Body() body: { productId: string },
    @ActiveUser() actor: ActorUser,
  ): Promise<Wishlist> {
    console.log('User ID: ', actor.id);
    console.log('Product ID', body.productId);

    return this.wishlistService.addToWishlist(body.productId, actor.id);
  }

  @Get('all')
  async getWishlist(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    return this.wishlistService.getWishlist(actor.id, query);
  }

  @Delete(':productId')
  async removeFromWishlist(
    @ActiveUser() actor: ActorUser,
    @Param('productId') productId: string,
  ): Promise<{ message: string }> {
    await this.wishlistService.removeFromWishlist(actor.id, productId);
    return { message: 'Product removed from wishlist successfully' };
  }
}
