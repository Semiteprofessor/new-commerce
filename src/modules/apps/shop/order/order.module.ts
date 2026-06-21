import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { User } from "src/modules/core/users/entities/user.entity";
import { ShippingAddress } from "./entities/shipping-address.entity";
import { BusinessProfile } from "../merchants/entities/business-profile.entity";
import { ReturnRequest } from "./entities/return-request.entity";
import { UserRepository } from "src/modules/core/users/repositories/user.repository";
import { Module } from "@nestjs/common";

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