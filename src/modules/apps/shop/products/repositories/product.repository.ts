import { Injectable } from "@nestjs/common";
import { EntityRepository } from "src/db/repository/entity.repository";
import { Product, Product as ProductEntity } from '../entities/product.entity';
import { Category } from "src/modules/apps/categories/entities/category.entity";
import { EntityManager, Repository, TreeRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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
  }
}