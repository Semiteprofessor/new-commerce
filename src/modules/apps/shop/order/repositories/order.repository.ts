import { PageInfo, PaginatedRecordsDto, QueryParamsDto } from "../../../../../modules/common/dtos/pagination.dto";
import { Order } from "../entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EntityRepository } from "../../../../../db/repository/entity.repository";


@Injectable()
export class OrderRepository extends EntityRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly _orderRepository: Repository<Order>,
  ) {
    super(_orderRepository);
  }
  async findAllByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Order>> {
    const {
      userId,
      orderStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    const orderQuery = this._orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.items', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('orders.deletedAt IS NULL');

    if (userId) {
      orderQuery.andWhere('orders.userId = :userId', { userId });
    }

    if (orderStatus) {
      const statusCondition =
        orderStatus === 'on-going'
          ? `orders.orderStatus IN ('pending', 'processing', 'shipped')`
          : 'orders.orderStatus = :orderStatus';
      orderQuery.andWhere(statusCondition, { orderStatus });
    }

    const totalCount = await orderQuery.clone().getCount();

    const data = await orderQuery
      .orderBy(`orders.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data, pageInfo };
  }

  async findByIds(
    ids: string[],
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Order>> {
    const {
      userId,
      orderStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    if (!ids.length) {
      throw new BadRequestException('Order IDs array cannot be empty.');
    }

    const whereClause: FindOptionsWhere<Order> = {
      id: In(ids),
      deletedAt: null,
    };

    //if (userId) whereClause.user.id = userId;
    if (orderStatus) whereClause.orderStatus = orderStatus;

    const [data, totalCount] = await this._orderRepository.findAndCount({
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

  async findSingleByQueryBuilder(query: QueryParamsDto): Promise<Order | null> {
    const { orderId, userId } = query;

    if (!orderId) {
      throw new BadRequestException('Order ID is required.');
    }

    const orderQuery = this._orderRepository
      .createQueryBuilder('orders')
      .where('orders.deletedAt is null')
      .andWhere('orders.id = :orderId', { orderId });

    if (userId) {
      orderQuery.andWhere('orders.userId = :userId', { userId });
    }

    return await orderQuery.getOne();
  }

  async update(orderId: string, data: Partial<Order>): Promise<Order> {
    if (!orderId) {
      throw new BadRequestException('Order ID is required');
    }

    const order = await this._orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    await this._orderRepository.update({ id: orderId }, data);

    return (await this._orderRepository.findOneBy({ id: orderId })) as Order;
  }
}