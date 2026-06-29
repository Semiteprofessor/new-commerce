import { Body, Controller, Post } from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';
import { Wishlist } from '../entities/wishlist.entity';
import { ActiveUser } from 'src/modules/core/iam/decorators/active-user.decorator';
import { ActorUser } from 'src/modules/common/types/user.types';

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
}
