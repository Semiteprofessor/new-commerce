import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ErpnextQueueService } from "src/modules/core/queue/erpnext-queue.service";
import { BusinessProfileRepository } from "src/modules/core/users/repositories/business.repository";
import { UserRepository } from "src/modules/core/users/repositories/user.repository";

const { customAlphabet } = require('nanoid');

const alphabet = '0123456789xg';
const nanoid = customAlphabet(alphabet, 10);

@Injectable()
export
class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly businessRepository: BusinessProfileRepository,
    // private readonly brandRepository: BrandRepository,
    // private readonly categoryService: CategoryService,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpQueueService: ErpnextQueueService,
    // private readonly wishlistRepository: WishlistRepository,
    // private readonly shippingAddressRepository: ShippingAddressRepository,
    // @Inject(forwardRef(() => ShippingAddressService))
    // private readonly shippingAddressService: ShippingAddressService,
    // private readonly orderRepository: OrderRepository,
    // private readonly orderItemRepository: OrderItemRepository,
    // private readonly reviewRepository: ReviewRepository,
    private readonly configService: ConfigService,
    // private readonly erpQueueService: ErpnextQueueService,
  ) {}
}