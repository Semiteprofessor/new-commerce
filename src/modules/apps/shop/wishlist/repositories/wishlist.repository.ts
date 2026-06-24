import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wishlist } from "../entities/wishlist.entity";
import { EntityRepository } from "src/db/repository/entity.repository";

@Injectable()
export class WishlistRepository extends EntityRepository<Wishlist> {
  constructor(
    @InjectRepository(Wishlist)
    private readonly _wishlistRepository: Repository<Wishlist>,
  ) {
    super(_wishlistRepository);
  }
}