import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { Cart } from '../entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartRepository extends EntityRepository<Cart> {
  constructor(
    @InjectRepository(Cart)
    private readonly _cartRepository: Repository<Cart>,
  ) {
    super(_cartRepository);
  }
}
