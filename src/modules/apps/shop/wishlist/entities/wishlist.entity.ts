import { Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { User } from '../../../../core/users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('wishlists')
export class Wishlist extends BaseEntity {
  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: 'wishlist_products',
    joinColumn: { name: 'wishlist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
