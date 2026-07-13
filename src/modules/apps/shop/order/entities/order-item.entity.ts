import { BaseEntity } from '../../../../../db/entity/base.entity';
import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../../../../modules/core/users/entities/user.entity';
import { OrderStatus } from '../enums/order.enum';
import { ReturnRequest } from './return-request.entity';

/**
 * add distance in km
 * add computed shipping fee
 */
@Entity('order_item')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;

  @ManyToOne(() => User, { nullable: false })
  @Index()
  merchant: User;

  @Column({ type: 'varchar', nullable: true })
  merchantId: string;

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'integer', nullable: false })
  qty: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  orderItemCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: true })
  discountedPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: true })
  commission: number;

  @Column({ type: 'text', nullable: false })
  sellerBusinessName: string;

  @Column({ type: 'varchar', nullable: true })
  imeiNumber?: string;

  @Column({ type: 'varchar', nullable: true })
  shipmentCode?: string;

  @Column({ type: 'varchar', nullable: true })
  deliveryCode?: string;

  @Column({ type: 'varchar', nullable: true, default: OrderStatus.PENDING })
  status: string;

  @OneToOne(() => ReturnRequest, (returnRequest) => returnRequest.orderItem, {
    nullable: true,
  })
  returnRequest: ReturnRequest;
}
