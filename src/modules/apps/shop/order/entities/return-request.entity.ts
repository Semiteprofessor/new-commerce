import { BaseEntity } from "src/db/entity/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "src/modules/core/users/entities/user.entity";

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
}