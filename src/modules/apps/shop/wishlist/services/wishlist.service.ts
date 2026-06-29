import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { ProductRepository } from '../../products/repositories/product.repository';
import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async addToWishlist(productId: string, userId: string): Promise<Wishlist> {
    if (!productId) {
      throw new BadRequestException('Product ID is required.');
    }

    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    let wishlist = await this.wishlistRepository.findOne(
      { user: { id: userId } },
      { relations: ['products'] },
    );

    if (wishlist && wishlist.products.some((p) => p.id === productId)) {
      throw new ConflictException('Product already in wishlist');
    }

    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({
        user,
        products: [product],
      });
    } else {
      wishlist.products.push(product);
      await this.wishlistRepository.updateWishlistProducts(
        wishlist.id,
        wishlist.products,
      );
    }

    return wishlist;
  }
}
