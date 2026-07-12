import { BaseEntity } from '../../../../../db/entity/base.entity';
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: false })
  @Index()
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: true })
  discountedPrice: number;
}
