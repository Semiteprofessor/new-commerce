import { BaseEntity } from "src/db/entity/base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";
import { User } from "src/modules/core/users/entities/user.entity";

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
}