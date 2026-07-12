import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository } from "../../../../../db/repository/entity.repository";
import { Repository } from "typeorm";
import { CartItem } from "../entities/cart-item.entity";

@Injectable()
export class CartItemRepository extends EntityRepository<CartItem> {
  constructor(
    @InjectRepository(CartItem)
    private readonly _cartItemRepository: Repository<CartItem>,
  ) {
    super(_cartItemRepository);
  }
}
