import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { ProductRepository } from '../../products/repositories/product.repository';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from 'src/modules/common/dtos/pagination.dto';

@Injectable()
export class WishlistService {
  constructor(
    private wishlistRepository: WishlistRepository,
    private readonly userRepository: UserRepository,
    private productRepository: ProductRepository,
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
      {
        user: {
          id: userId,
        },
      },
      {
        relations: {
          products: true,
        },
      },
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

  async getWishlist(userId: string, query: QueryParamsDto): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const wishlistQuery = this.wishlistRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.products', 'product')
      .leftJoinAndSelect('product.business', 'business')
      .where('wishlist.userId = :userId', { userId })
      .andWhere('wishlist.deletedAt IS NULL');

    const total = await wishlistQuery.clone().getCount();

    const wishlist = await wishlistQuery
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const products = wishlist.flatMap((item) => item.products);

    return {
      data: products,
      pageInfo: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    let wishlistItem = await this.wishlistRepository.findOne(
      {
        user: {
          id: userId,
        },
      },
      {
        relations: {
          products: true,
        },
      },
    );

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist not found');
    }

    const updatedProducts = wishlistItem.products.filter(
      (product) => product.id !== productId,
    );

    await this.wishlistRepository.updateWishlistProducts(
      wishlistItem.id,
      updatedProducts,
    );
  }
}
