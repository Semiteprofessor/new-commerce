import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ErpnextQueueService } from "src/modules/core/queue/erpnext-queue.service";
import { BusinessProfileRepository } from "src/modules/core/users/repositories/business.repository";
import { UserRepository } from "src/modules/core/users/repositories/user.repository";
import { ProductRepository } from "../repositories/product.repository";

import slugify from 'slugify';
import { CreateProductDto } from "../dto/product.dto";
import { ActorUser } from "src/modules/common/types/user.types";
import { Product } from "../entities/product.entity";
import { PaginatedRecordsDto, QueryParamsDto } from "src/modules/common/dtos/pagination.dto";

const { customAlphabet } = require('nanoid');

const alphabet = '0123456789xg';
const nanoid = customAlphabet(alphabet, 10);

@Injectable()
export class ProductService {
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
        message: e.message,
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
        message: e.message,
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
        relations: [
          'category',
          'category.parent',
          'category.parent.parent',
          'reviews',
        ],
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
        relations: [
          'category',
          'category.parent',
          'category.parent.parent',
          'reviews',
        ],
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
}