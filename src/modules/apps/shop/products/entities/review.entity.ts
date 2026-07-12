import { Product } from './product.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Column, Index, ManyToOne } from 'typeorm';
import { User } from 'src/modules/core/users/entities/user.entity';
import { BaseEntity } from 'src/db/entity/base.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'json', nullable: true })
  issues: string[];

  @Index()
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @Index()
  @ManyToOne(() => User, (user) => user.reviews, { cascade: true })
  user: User;
}
