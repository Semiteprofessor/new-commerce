
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, ShippingAddress, BusinessProfile, ReturnRequest]),
    CartModule,
    RedisModule,
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
    EscrowModule,
    forwardRef(() => WalletModule)
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
  controllers: [OrdersController, ShippingAddressController],
  exports: [
    OrdersService,
    OrderRepository,
    OrderItemRepository,
    ShippingAddressRepository,
    ShippingAddressService,
    BusinessProfileRepository,
    ItranxitService,
    ReturnRequestRepository, 
    ReturnRequestService
  ],})