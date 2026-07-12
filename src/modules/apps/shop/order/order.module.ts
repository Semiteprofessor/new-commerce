<<<<<<< HEAD
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../modules/core/users/entities/user.entity';
import { OrdersService } from './services/order.service';
import { OrderRepository } from './repositories/order.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemRepository } from './repositories/order-item.repository';
import { ShippingAddressRepository } from './repositories/shipping-address.repository';
import { ShippingAddressService } from './services/shipping-address.service';
import { ShippingAddress } from './entities/shipping-address.entity';

import { BusinessProfileRepository } from '../merchants/repositories/business-profile.repository';
import { BusinessProfile } from '../merchants/entities/business-profile.entity';
import { CartModule } from '../cart/cart.module';
import { RedisModule } from '../../../../modules/redis/redis.module';
import { UserRepository } from '../../../core/users/repositories/user.repository';
import { ItranxitService } from '../../../../modules/itranxit/services/itranxit.service';
import { EscrowModule } from '../escrow/escrow.module';
import { ReturnRequestRepository } from './repositories/return-request.repository';
import { ReturnRequest } from './entities/return-request.entity';
import { WalletModule } from '../../wallet/wallet.module';
import { ProductModule } from '../products/product.module';
import { MerchantOrdersController } from '../merchants/controllers/merchant-orders.controller';
import { ReturnRequestService } from './services/return-request.service';
import { ShippingAddressController } from './controllers/shipping-address.controller';
=======
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { User } from "src/modules/core/users/entities/user.entity";
import { ShippingAddress } from "./entities/shipping-address.entity";
import { BusinessProfile } from "../merchants/entities/business-profile.entity";
import { ReturnRequest } from "./entities/return-request.entity";
import { UserRepository } from "src/modules/core/users/repositories/user.repository";
import { Module } from "@nestjs/common";
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      User,
      ShippingAddress,
      BusinessProfile,
      ReturnRequest,
    ]),
<<<<<<< HEAD
    EscrowModule,
    RedisModule,
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
    forwardRef(() => WalletModule),
  ],
  providers: [
    OrdersService,
    OrderRepository,
    OrderItemRepository,
    ShippingAddressRepository,
    BusinessProfileRepository,
    ShippingAddressService,
    UserRepository,
    ItranxitService,
    ReturnRequestRepository,
    ReturnRequestService,
  ],
  controllers: [MerchantOrdersController, ShippingAddressController],
  exports: [
    OrdersService,
    OrderRepository,
    OrderItemRepository,
    ShippingAddressRepository,
    ShippingAddressService,
    BusinessProfileRepository,
    ItranxitService,
    ReturnRequestRepository,
    ReturnRequestService,
  ],
})
export class OrderModule {}
=======
    // CartModule,
    // RedisModule,
    // forwardRef(() => CartModule),
    // forwardRef(() => ProductModule),
    // EscrowModule,
    // forwardRef(() => WalletModule),
  ],
  providers: [
    // OrdersService,
    // OrderRepository,
    // OrderItemRepository,
    // ShippingAddressRepository,
    // BusinessProfileRepository,
    // ShippingAddressService,
    UserRepository,
    // ItranxitService,
    // ReturnRequestRepository,
    // ReturnRequestService,
  ],
//   controllers: [OrdersController, ShippingAddressController],
  exports: [
    // OrdersService,
    // OrderRepository,
    // OrderItemRepository,
    // ShippingAddressRepository,
    // ShippingAddressService,
    // BusinessProfileRepository,
    // ItranxitService,
    // ReturnRequestRepository,
    // ReturnRequestService,
  ],
})
export class OrderModule {}
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
