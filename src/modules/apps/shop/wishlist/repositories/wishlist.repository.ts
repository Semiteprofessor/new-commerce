import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wishlist } from "../entities/wishlist.entity";
import { EntityRepository } from "src/db/repository/entity.repository";
import { PageInfo, PaginatedRecordsDto, QueryParamsDto } from "src/modules/common/dtos/pagination.dto";
import { Product } from "../../products/entities/product.entity";

@Injectable()
export class WishlistRepository extends EntityRepository<Wishlist> {
  constructor(
    @InjectRepository(Wishlist)
    private readonly _wishlistRepository: Repository<Wishlist>,
  ) {
    super(_wishlistRepository);
  }

  async findAllWishlistByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Product>> {
    const {
      userId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    const wishlistQuery = this._wishlistRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.products', 'product')
      .leftJoinAndSelect('product.business', 'business')
      .where('wishlist.deletedAt IS NULL');

    if (userId) {
      wishlistQuery.andWhere('wishlist.userId = :userId', { userId });
    }

    const totalCount = await wishlistQuery.clone().getCount();

    const wishlist = await wishlistQuery
      .orderBy(`wishlist.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const products = wishlist.flatMap((item) => item.products);

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data: products, pageInfo };
  }
}