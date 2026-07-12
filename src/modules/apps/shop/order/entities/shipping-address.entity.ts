import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { User } from '../../../../core/users/entities/user.entity';

@Entity('shipping_address')
export class ShippingAddress extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.shippingAddresses, {
    onDelete: 'CASCADE',
  })
  user: ShippingAddress;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  phone1: string;

  @Column({ type: 'varchar', nullable: true })
  phone2: string;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  lga: string;

  @Column({ type: 'varchar', nullable: true })
  postalCode?: string;

  @Column({ type: 'varchar', nullable: true })
  state?: string;

  @Column({ type: 'boolean', nullable: false })
  isDefault?: boolean;
}
