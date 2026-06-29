import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from 'src/modules/core/users/entities/user.entity';import { Wishlist } from './entities/wishlist.entity';
import { WishlistRepository } from './repositories/wishlist.repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { WishlistService } from './services/wishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Wishlist])],
  providers: [
    WishlistRepository,
    ProductRepository,
    UserRepository,
    WishlistService,
  ],
  controllers: [WishlistController],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule {}
