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
import { ShippingAddress } from '../entities/shipping-address.entity';

@Injectable()
export class ShippingAddressRepository extends EntityRepository<ShippingAddress> {
  constructor(
    @InjectRepository(ShippingAddress)
    private readonly _shippingAddressRepository: Repository<ShippingAddress>,
  ) {
    super(_shippingAddressRepository);
  }
}
