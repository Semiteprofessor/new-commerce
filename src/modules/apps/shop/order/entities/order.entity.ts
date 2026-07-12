import { User } from 'src/modules/core/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { OrderSource, OrderStatus } from '../enums/order.enum';
import { ShippingAddress } from './shipping-address.entity';
import { Coupon } from '../../products/entities/coupon.entity';

// User selects items from cart ✅
// Cart items are copied to OrderItems ✅
// Stock is deducted from Product ✅
// OrderStatus starts at PENDING ✅
// Payment is processed ✅
// Shipping and delivery tracking begins ✅
/**
 * Add total distance in km
 * Add total shipping fee
 */

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

  @Column({ type: 'boolean', default: false })
  shipmentCodeUsed?: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  deliveryCode?: string;

  @Column({ type: 'boolean', default: false })
  deliveryCodeUsed?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders, {
    nullable: true,
    eager: true,
  })
  coupon: Coupon;
}
