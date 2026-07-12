import { BaseEntity } from "../../../../../db/entity/base.entity";
import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { Cart } from "../../cart/entities/cart.entity";
import { Order } from "../../order/entities/order.entity";

@Entity('coupons')
export class Coupon extends BaseEntity {
  @Index()
  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  pricingRule: any;

  @Column('decimal')
  discount: number;

  @Column({ type: 'int', nullable: true })
  maxUsage?: number;

  @Column({ type: 'int', nullable: true })
  usedCount?: number;

  @Column({ type: 'timestamp', nullable: true })
  validFrom?: Date;

  @Column({ type: 'timestamp', nullable: true })
  validTo?: Date;

  @ManyToMany(() => Product, (product) => product.coupons)
  products: Product[];

  @OneToMany(() => Cart, (cart) => cart.coupon, { cascade: true })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.coupon, { cascade: true })
  orders: Order[];
}