import { BaseEntity } from 'src/db/entity/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/modules/core/users/entities/user.entity';

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
