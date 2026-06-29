import { Injectable } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { ProductRepository } from '../../products/repositories/product.repository';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}
}
