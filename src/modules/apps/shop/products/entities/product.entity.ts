import { BaseEntity } from "src/db/entity/base.entity";
import { User } from "src/modules/core/users/entities/user.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'text' })
  productName: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Index()
  category: Category;

  @ManyToOne(() => User, {
    nullable: false,
  })
  merchant: User;

  @Column({ nullable: true })
  @Index()
  merchantId: string;
}