
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
  ],})