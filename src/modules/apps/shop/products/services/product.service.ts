import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ErpnextQueueService } from 'src/modules/core/queue/erpnext-queue.service';
import { BusinessProfileRepository } from 'src/modules/core/users/repositories/business.repository';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';

import slugify from 'slugify';
import { CreateProductDto } from '../dto/product.dto';
import { ActorUser } from 'src/modules/common/types/user.types';
import { Product } from '../entities/product.entity';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from 'src/modules/common/dtos/pagination.dto';
import { ErrorCodes } from 'src/modules/common/error-codes.enum';
import { UserEvents } from 'src/modules/common/app.events';
import { ProductStatuses } from '../enums/product.enum';
import { BuyNowDto } from '../../cart/dto/cart';

const { customAlphabet } = require('nanoid');

const alphabet = '0123456789xg';
const nanoid = customAlphabet(alphabet, 10);

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly businessRepository: BusinessProfileRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryService: CategoryService,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpQueueService: ErpnextQueueService,
    private readonly wishlistRepository: WishlistRepository,
    private readonly shippingAddressRepository: ShippingAddressRepository,
    @Inject(forwardRef(() => ShippingAddressService))
    private readonly shippingAddressService: ShippingAddressService,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly configService: ConfigService,
    private readonly erpQueueService: ErpnextQueueService,
  ) {}

  async createProduct(actor: ActorUser, data: CreateProductDto): Promise<any> {
    const {
      categoryId,
      actualPrice,
      discountedPrice,
      productName,
      discount,
      description,
      quantity,
      images,
      brand,
      model,
      weight,
      specification,
      warranty,
      color,
    } = data;

    const businessProfile = await this.businessRepository.findOne({
      owner: { id: actor.id },
    });

    if (!businessProfile) {
      throw new Error('Business profile not found for this user.');
    }

    const category = await this.categoryService.findCategoryById(categoryId);

    const _product: Partial<Product> = {
      productName,
      discount,
      merchantId: actor.id,
      actual_price: parseFloat(String(actualPrice)),
      specification,
      discounted_price: discountedPrice,
      description,
      quantity,
      images,
      brand,
      model,
      weight,
      category,
      businessId: businessProfile.id,
      warranty,
      hasWarranty: !!warranty,
      color,
      slug: `${slugify(productName, { lower: true, strict: true })}-${nanoid()}`,
    };

    const product = await this.productRepository.create(_product);

    await this.erpQueueService.enqueueCreateErpNextProduct(product);

    return product;
  }

  // for shoppers app and website
  async getAllOpenProducts(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    if (query.brandSlug) {
      const brand = await this.brandRepository.findOne({
        slug: query.brandSlug,
      });
      if (!brand)
        throw new NotFoundException(`Brand with slug ${brand.slug} not found.`);
      query.brand = brand.name;
    }
    let category;
    if (query.categoryId) {
      category = await this.categoryService.findCategoryById(query.categoryId);
      if (!category) throw new NotFoundException(`Category not found .`);
    }

    return await this.productRepository.findAllByQueryBuilder(query, category);
  }

  // for shoppers app and website
  async getProductTl(): Promise<any> {
    const data = await Promise.all([
      this.productRepository.getProductsForTimeline('electronics'),
      this.productRepository.getProductsForTimeline('phones-tablets'),
      this.productRepository.getProductsForTimeline('computing'),
      this.productRepository.getProductsForTimeline('home-appliances'),
    ]);

    const flattenedData = data.reduce((acc, categoryObj) => {
      return { ...acc, ...categoryObj };
    }, {});

    return flattenedData;
  }

  //Merchant get all products
  async getAllProducts(
    query: QueryParamsDto,
    userId?: string,
  ): Promise<PaginatedRecordsDto<Product>> {
    if (userId) query.userId = userId;

    try {
      return await this.productRepository.findAllByQueryBuilder(query);
    } catch (e) {
      throw new BadRequestException({
        errorCode: '',
        message:
          e instanceof Error ? e.message : 'An unexpected error occurred',
      });
    }
  }

  async getAllShortageProducts(
    query: QueryParamsDto,
    userId?: string,
  ): Promise<PaginatedRecordsDto<Product>> {
    if (userId) query.userId = userId;
    query.shortage <= 5;
    try {
      return await this.productRepository.findAllByQueryBuilder(query);
    } catch (e) {
      throw new BadRequestException({
        errorCode: '',
        message:
          e instanceof Error ? e.message : 'An unexpected error occurred',
      });
    }
  }

  async updateShortageProduct(
    productId: string,
    quantity: number,
    userId: string,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      id: productId,
      merchantId: userId,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (product.quantity > 5) {
      throw new BadRequestException(`Product quantity is not in shortage.`);
    }

    const updatedProduct = await this.productRepository.findOneAndUpdate(
      { id: productId },
      {
        quantity,
      },
    );

    return updatedProduct!;
  }

  async getSingleProductBySlug(slug: string) {
    const product = await this.productRepository.findOne(
      { slug },
      {
        relations: {
          category: {
            parent: {
              parent: true,
            },
          },
          reviews: true,
        },
      },
    );

    if (!product) return null;

    const brand = await this.brandRepository.findOne({ name: product.brand });

    return {
      ...product,
      brandSlug: brand?.slug,
    };
  }

  async getSingleProductById(id: string, userId?: string) {
    await this.productBelongsToMerchant(userId, id);
    const product = await this.productRepository.findOne(
      { id },
      {
        relations: {
          category: {
            parent: {
              parent: true,
            },
          },
          reviews: true,
        },
      },
    );

    if (!product) return null;
    const brand = await this.brandRepository.findOne({ name: product.brand });

    return {
      ...product,
      brandSlug: brand?.slug,
    };
  }

  // update product sku after submitting to erpNext
  async updateProductAfterErpNextSubmission(data): Promise<void> {
    await this.productRepository.findOneAndUpdate(
      { id: data.id },
      { erpSKUNumber: data.sku },
    );
  }

  async updateProductStatus(data): Promise<void> {
    let status = data.is_live
      ? ProductStatuses.LIVE
      : ProductStatuses.IN_REVIEW;
    await this.productRepository.findOneAndUpdate(
      { erpSKUNumber: data.item_code },
      { status },
    );
  }

  private async productBelongsToMerchant(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const product = await this.productRepository.findOne({
      id: productId,
      deletedAt: null,
    });
    if (!product) {
      throw new NotFoundException({
        errorCode: ErrorCodes.PRODUCT_NOT_FOUND,
        message: 'Product not found',
      });
    }
    return product.merchantId !== userId;
  }

  async getProductsByCategory(categorySlug: string, query: QueryParamsDto) {
    const category =
      await this.categoryService.findCategoryBySlug(categorySlug);

    const wishlistProducts = await this.wishlistRepository.find(
      {},
      { relations: ['products'] },
    );
    const wishlistProductIds = wishlistProducts
      .map((wishlist) => wishlist.products.map((p) => p.id))
      .flat();

    if (!category) {
      throw new NotFoundException({
        errorCode: ErrorCodes.CATEGORY_NOT_FOUND,
        message: 'Category not found',
      });
    }
    query.categoryId = category.id;
    let result = await this.productRepository.findAllByQueryBuilder(
      query,
      category,
    );
    return {
      data: result.data.map((item) => ({
        ...item,
        isFavourite: wishlistProductIds.includes(item.id),
      })),
      pageInfo: result.pageInfo,
    };
  }

  async buyNow(dto: BuyNowDto, actorUser: ActorUser) {
    const product = await this.productRepository.findOne({ id: dto.productId });
    if (!product) throw new NotFoundException('Product not found');
    const user = await this.userRepository.findOne({ id: actorUser.id });

    const shippingAddress = await this.shippingAddressRepository.findOne({
      id: dto.shippingAddressId,
    });
    if (!shippingAddress)
      throw new NotFoundException('Shipping address not found');

    const business = await this.businessRepository.findOne({
      owner: { id: product.merchantId },
    });
    if (!business) throw new NotFoundException('Business not found');

    let price =
      product.discounted_price > 0
        ? product.discounted_price
        : product.actual_price;
    let itemsPrice = price * dto.quantity;
    let shippingResponse =
      await this.shippingAddressService.calculateShippingFeeWithoutCart(
        actorUser,
        {
          latitude: shippingAddress.latitude,
          longitude: shippingAddress.longitude,
          address: shippingAddress.address,
        },
        product.merchantId,
        dto.quantity,
      );
    let shippingFee = shippingResponse ? shippingResponse?.shippingFee : 0;

    const order = await this.orderRepository.create({
      user,
      shippingAddress,
      paymentMethod: dto.paymentMethod,
      items: [],
      subtotal: itemsPrice,
      discount: 0,
      shippingFee,
      grandTotal: Number(itemsPrice) + Number(shippingFee),
    });
    console.log(order);
    const orderItem = await this.orderItemRepository.create({
      order,
      product,
      qty: dto.quantity,
      price: product.actual_price,
      discountedPrice: product.discounted_price,
      merchant: product.merchant,
      merchantId: product.merchantId,
      productId: product.id,
      sellerBusinessName: business.name,
      orderItemCode: `${nanoid(8)}`.toUpperCase(),
    });

    order.items.push(orderItem);
    const merchant = await this.userRepository.findOne({
      id: product.merchantId,
    });
    this.eventEmitter.emit(UserEvents.SEND_ORDER_CREATED, {
      email: merchant.email,
      firstName: merchant.firstName,
      products: [
        {
          name: product.productName,
          price,
          quantity: product.quantity,
          image: product.images?.[0]?.url,
          warranty: product.warranty,
          skuNumber: product.erpSKUNumber,
          orderId: order.id,
          date: order.createdAt,
        },
      ],
      orderUrl: `${process.env.APP_URL}`,
    });

    this.eventEmitter.emit(UserEvents.SEND_ORDER_INVOICE, {
      orderId: order.id,
      email: order.user.email,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      items: [
        {
          name: product.productName,
          price,
          quantity: product.quantity,
          image: product.images?.[0]?.url,
        },
      ],
      paymentMethod: order.paymentMethod,
      date: order.createdAt,
      shippingAddress: order.shippingAddress,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      total: order.grandTotal,
      orderUrl: `${this.configService.get('SHOPPERS_URL')}/profile/orders/${order?.id}/track`,
    });

    await this.erpQueueService.enqueueCreateErpNextOrder(order);
    return order;
  }

  async rateProduct(id: string, userId: string, dto: CreateReviewDto) {
    const product = await this.productRepository.findOne({ id });

    if (!product) throw new NotFoundException('Product not found');
    const user = await this.userRepository.findOne({ id: userId });

    const productRatedByUser = await this.reviewRepository.findOne({
      product: { id },
      user: { id: userId },
    });

    if (productRatedByUser)
      throw new BadRequestException('You have rated this product already');
    const review = await this.reviewRepository.create({
      ...dto,
      type: 'product',
      user,
      product,
    });

    return review;
  }
}
