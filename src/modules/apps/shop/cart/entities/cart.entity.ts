import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
<<<<<<< HEAD
import { User } from '../../../../../modules/core/users/entities/user.entity';
=======
import { User } from 'src/modules/core/users/entities/user.entity';
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { Coupon } from '../../products/entities/coupon.entity';
import { CartItem } from './cart-item.entity';

@Entity('cart')
export class Cart extends BaseEntity {
  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @Column({ nullable: false })
  userId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @Column({ type: 'decimal', default: 0 })
  itemsPrice: number;

  // @Column({ type: 'decimal', default: 0 })
  // taxPrice: number;

  @Column({ type: 'decimal', default: 0 })
  shippingPrice: number;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @Column({ type: 'decimal', default: 0 })
  totalDiscount?: number;

  @Column({ type: 'decimal', default: 0 })
  couponDiscount: number;

  @ManyToOne(() => Coupon, (coupon) => coupon.carts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  coupon: Coupon;

  @Column({ type: 'boolean', default: false })
  couponApplied: boolean;
}
