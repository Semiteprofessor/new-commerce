import { BaseEntity } from "src/db/entity/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ShippingAddress } from "./shipping-address.entity";

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    eager: true,
  })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => ShippingAddress, { onDelete: 'CASCADE', eager: true })
  shippingAddress: ShippingAddress;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId?: string;

  @Column({ type: 'varchar', nullable: false })
  paymentMethod: string;

  @Column({ type: 'decimal', default: 0.0 })
  shippingFee: number;

  @Column({ type: 'varchar', nullable: true, default: OrderSource.ONLINE })
  orderSource: string;
}