import {
  Entity,
  Column,
  ManyToOne,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { User } from '../../../../core/users/entities/user.entity';
import { ReturnRequestStatus } from '../enums/order.enum';
import { OrderItem } from './order-item.entity';

@Entity('return_request')
export class ReturnRequest extends BaseEntity {
  @OneToOne(() => OrderItem, { nullable: false })
  @JoinColumn()
  @Index()
  orderItem: OrderItem;

  @ManyToOne(() => User, { nullable: false })
  @Index()
  user: User;

  @Column({ type: 'varchar', nullable: false })
  reason: string;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column('json', { nullable: true })
  media: { url: string; alt?: string; type?: string }[];

  @Column('json', { nullable: false })
  address: { lat: number; long: number; address: string };

  @Column({ type: 'text', nullable: false })
  receipt: string;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  adminComment: string;

  @Column({ type: 'varchar', nullable: true })
  decision: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: ReturnRequestStatus.PENDING,
  })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  dateApproved?: Date;
}
