import { Injectable } from "@nestjs/common";
import { EntityRepository } from "src/db/repository/entity.repository";
import { Product, Product as ProductEntity } from '../entities/product.entity';
import { Category } from "src/modules/apps/categories/entities/category.entity";
import { EntityManager, Repository, TreeRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedRecordsDto, QueryParamsDto } from "src/modules/common/dtos/pagination.dto";

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
  ): Promise<PaginatedRecordsDto<Product>> {}
}