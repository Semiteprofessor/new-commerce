import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { Order } from 'src/modules/apps/shop/order/entities/order.entity';

import { Cart } from 'src/modules/apps/shop/cart/entities/cart.entity';
import { CartItem } from 'src/modules/apps/shop/cart/entities/cart-item.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
<<<<<<< HEAD
import { Wishlist } from 'src/modules/apps/shop/wishlist/entities/wishlist.entity';
import { BusinessProfileRepository } from 'src/modules/apps/shop/merchants/repositories/business-profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BusinessProfile,
      Cart,
      CartItem,
      Order,
      Wishlist,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, BusinessProfileRepository],
  exports: [UserService, UserRepository, BusinessProfileRepository],
})
export class UserModule {}
=======
import { BusinessProfileRepository } from './repositories/business.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BusinessProfile, Cart, CartItem, Order]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, BusinessProfileRepository],
  exports: [UserService, BusinessProfileRepository, UserRepository],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {
    // this.userService.createWalletForAllExistingUsers().then().catch();
  }

  async onModuleInit(): Promise<any> {
    // await this.userService.createWalletForAllExistingUsers();
  }
}
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
