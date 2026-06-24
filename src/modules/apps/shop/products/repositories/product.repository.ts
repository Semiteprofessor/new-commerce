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
}