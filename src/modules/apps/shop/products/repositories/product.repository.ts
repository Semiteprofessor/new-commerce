import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EntityRepository } from "src/db/repository/entity.repository";
import { Product, Product as ProductEntity } from '../entities/product.entity';
import { Category } from "src/modules/apps/categories/entities/category.entity";
import { EntityManager, Repository, TreeRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PageInfo, PaginatedRecordsDto, QueryParamsDto } from "src/modules/common/dtos/pagination.dto";

@Injectable()
export class ProductRepository extends EntityRepository<ProductEntity> {
  private readonly _categoryRepository: TreeRepository<Category>;
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
    private readonly entityManager: EntityManager,
    private readonly wishlistRepository: WishlistRepository,
  ) {
    super(_productRepository);
    this._categoryRepository = this.entityManager.getTreeRepository(Category);
  }

  async getProductsForTimeline(categorySlug: string): Promise<any> {
    const parentCategory = await this._categoryRepository.findOne({
      where: { slug: categorySlug },
    });
    if (!parentCategory) {
      throw new Error(`Category with slug "${categorySlug}" not found`);
    }

    const descendants =
      await this._categoryRepository.findDescendants(parentCategory);
    const allCategoryIds = descendants.map((cat) => cat.id);

    const wishlistProducts = await this.wishlistRepository.find(
      {},
      { relations: ['products'] },
    );
    const wishlistProductIds = wishlistProducts
      .map((wishlist) => wishlist.products.map((p) => p.id))
      .flat();

    const productQuery = this._productRepository
      .createQueryBuilder('products')
      .innerJoin(
        'categories',
        'categories',
        'products.categoryId = categories.id',
      )
      .where('products.deletedAt IS NULL')
      .andWhere('products.categoryId IN (:...categoryIds)', {
        categoryIds: allCategoryIds,
      })
      .select([
        'products',
        'categories.name AS categoryName',
        'categories.slug AS categorySlug',
      ]);

    const rawProducts = await productQuery.getRawMany();

    const groupedProducts = rawProducts.reduce(
      (acc, row) => {
        // console.log(row);
        const categoryName = row.categoryname || row.categories_name;
        const categorySlug = row.categoryslug || row.categories_slug;

        if (!categoryName || !categorySlug) {
          console.error('Category name or slug is missing:', row);
          return acc;
        }

        const product = {
          id: row.products_id,
          productName: row.products_productName,
          category: row.products_categoryId,
          actual_price: parseFloat(row.products_actual_price),
          discounted_price: parseFloat(row.products_discounted_price),
          quantity: row.products_quantity,
          discount: row.products_discount,
          isFavourite: wishlistProductIds.includes(row.products_id),
          createdAt: row.products_createdAt,
          images: row.products_images,
          warranty: row.products_warranty,
          model: row.products_model,
          slug: row.products_slug,
        };

        acc.push(product);
        return acc;
      },
      [],
      // {} as Record<string, { categoryName: string; products: Product[] }>,
    );

    return { [categorySlug]: groupedProducts };
  }

  async findAllByQueryBuilder(
    query: QueryParamsDto,
    category?: Category,
  ): Promise<PaginatedRecordsDto<Product>> {
    const {
      status,
      shortage,
      sortOrder,
      startsAt,
      endsAt,
      sortBy,
      limit,
      page,
      userId,
      categoryId,
      brand,
      actualPrice,
      discountedPrice,
      minAmount,
      maxAmount,
      color,
      discount,
      search,
    } = query;

    const productQuery = this._productRepository
      .createQueryBuilder('products')
      .where('products.deletedAt is null');
    if (category) {
      const descendants =
        await this._categoryRepository.findDescendants(category);
      const categoryIds = descendants.map((cat) => cat.id);
      productQuery.andWhere('products.categoryId IN (:...categoryIds)', {
        categoryIds,
      });
    }

    // Todo
    // .andWhere('category.mpath LIKE :path', { path: `${category?.mpath}%` });
    // Todo: Cache categories
    // const categoryTreeCacheKey = `category_tree_${parentCategory.id}`;
    // let categoryIds: number[];
    //
    // const cachedCategoryIds = await this.cacheManager.get(categoryTreeCacheKey);
    // if (cachedCategoryIds) {
    //   categoryIds = cachedCategoryIds;
    // } else {
    //   const descendants = await categoryTreeRepository.findDescendants(parentCategory);
    //   categoryIds = descendants.map(cat => cat.id);
    //   // Cache for 1 hour (or adjust based on how frequently categories change)
    //   await this.cacheManager.set(categoryTreeCacheKey, categoryIds, { ttl: 3600 });
    // }

    if (userId) {
      productQuery.andWhere('products.merchantId = :merchantId', {
        merchantId: userId,
      });
    }

    if (brand) {
      productQuery.andWhere('products.brand = :brand', { brand });
    }

    // if (actualPrice) {
    //   productQuery.andWhere('products.actual_price BETWEEN :minActualPrice AND :maxActualPrice', {
    //     minActualPrice: Number(actualPrice) * 0.8,
    //     maxActualPrice: Number(actualPrice) * 1.2,
    //   });
    // }

    // if (discountedPrice) {
    //   productQuery.andWhere(
    //     'products.discounted_price BETWEEN :minDiscountedPrice AND :maxDiscountedPrice',
    //     {
    //       minDiscountedPrice: Number(discountedPrice) * 0.8,
    //       maxDiscountedPrice: Number(discountedPrice) * 1.2,
    //     },
    //   );
    // }

    if (minAmount !== undefined && maxAmount !== undefined) {
      productQuery.andWhere(
        'products.discounted_price BETWEEN :minPrice AND :maxPrice',
        {
          minPrice: minAmount,
          maxPrice: maxAmount,
        },
      );
    } else if (minAmount !== undefined) {
      productQuery.andWhere('products.discounted_price >= :minPrice', {
        minAmount,
      });
    } else if (maxAmount !== undefined) {
      productQuery.andWhere('products.discounted_price <= :maxPrice', {
        maxAmount,
      });
    }

    if (discount) {
      productQuery.andWhere('products.discount >= :discount', { discount });
    }

    if (startsAt && endsAt) {
      productQuery.andWhere(
        `products.createdAt BETWEEN :startsAt AND :endsAt`,
        {
          startsAt,
          endsAt,
        },
      );
    }

    if (shortage) {
      productQuery.andWhere('products.quantity < :shortage', { shortage });
    }

    if (color) {
      productQuery.andWhere('products.color::jsonb @> :color', {
        color: JSON.stringify([{ color: query.color }]),
      });
    }

    if (search) {
      productQuery.andWhere(
        '(products.productName ILIKE :search OR products.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const totalCount = await productQuery.clone().getCount();
    const validSortColumns = [
      'createdAt',
      'actual_price',
      'discounted_price',
      'rating',
    ];
    const sortColumn = validSortColumns.includes(sortBy)
      ? `products.${sortBy}`
      : 'products.createdAt';

    productQuery
      .orderBy(sortColumn, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const data = await productQuery.getMany();

    const pageInfo: PageInfo = {
      total: totalCount,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data, pageInfo };
  }

  async findSingleByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<Product | null> {
    const { productId, userId } = query;

    const productQuery = this._productRepository
      .createQueryBuilder('products')
      .where('products.deletedAt is null');

    if (productId) {
      productQuery.andWhere('products.id = :productId', { productId });
    } else {
      throw new BadRequestException('Product ID is required.');
    }

    if (userId) {
      productQuery.andWhere('products.merchantId = :merchantId', {
        merchantId: userId,
      });
    }

    return await productQuery.getOne();
  }

  async update(productId: string, data: Partial<Product>): Promise<Product> {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this._productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    await this._productRepository.update({ id: productId }, data);

    return (await this._productRepository.findOneBy({
      id: productId,
    })) as Product;
  }
}