import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import {
  PageInfo,
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../common/dtos/pagination.dto';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository extends EntityRepository<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly _orderItemRepository: Repository<OrderItem>,
  ) {
    super(_orderItemRepository);
  }

  async findAllByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<OrderItem>> {
    const {
      userId,
      orderIds,
      orderStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = 10,
      page = 1,
    } = query;

    const orderItemQuery = this._orderItemRepository
      .createQueryBuilder('order_items')
      .leftJoinAndSelect('order_items.product', 'product')
      .leftJoinAndSelect('order_items.returnRequest', 'returnRequest')
      .leftJoinAndSelect('order_items.order', 'order')
      .where('order_items.deletedAt IS NULL');

    if (userId) {
      orderItemQuery.andWhere('order_items.merchantId = :userId', { userId });
    }

    if (orderIds && orderIds.length > 0) {
      orderItemQuery.andWhere('order_items.orderId IN (:...orderIds)', {
        orderIds,
      });
    }

    if (orderStatus) {
      const statusCondition =
        orderStatus === 'on-going'
          ? `order_items.status IN ('pending', 'processing', 'shipped')`
          : 'order_items.status = :orderStatus';

      console.log(orderStatus);
      orderItemQuery.andWhere(statusCondition, { orderStatus });
    }

    const totalCount = await orderItemQuery.clone().getCount();

    const data = await orderItemQuery
      .orderBy(`order_items.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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
}
