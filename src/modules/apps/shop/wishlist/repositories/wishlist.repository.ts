import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
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

  async findByIds(
    ids: string[],
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Wishlist>> {
    const {
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    if (!ids.length) {
      throw new BadRequestException('Order IDs array cannot be empty.');
    }

    const whereClause: FindOptionsWhere<Wishlist> = {
      id: In(ids),
      deletedAt: null,
    };

    const [data, totalCount] = await this._wishlistRepository.findAndCount({
      where: whereClause,
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data, pageInfo };
  }

  async updateWishlistProducts(
    wishlistId: string,
    products: Product[],
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(
      { id: wishlistId },
      {
        relations: {
          products: true,
        },
      },
    );

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found.');
    }

    wishlist.products = products;

    return this.entityRepository.save(wishlist);
  }
}