import { BaseEntity } from "src/db/entity/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ShippingAddress } from "./shipping-address.entity";
import { OrderSource, OrderStatus } from "../enums/order.enum";
import { OrderItem } from "./order-item.entity";
import { User } from "src/modules/core/users/entities/user.entity";

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

  @Column({ type: 'varchar', nullable: true, default: OrderStatus.PENDING })
  orderStatus: string;

  @Column({ type: 'decimal', default: 0.0 })
  discount: number;

  @Column({ type: 'decimal', default: 0.0 })
  subtotal: number;

  @Column({ type: 'decimal', default: 0.0 })
  grandTotal: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trackingNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shipmentStatus?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shipmentCode?: string;
}