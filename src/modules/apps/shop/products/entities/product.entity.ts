<<<<<<< HEAD
import { BaseEntity } from '../../../../../db/entity/base.entity';
import { User } from '../../../../../modules/core/users/entities/user.entity';
=======
import { BaseEntity } from 'src/db/entity/base.entity';
import { User } from 'src/modules/core/users/entities/user.entity';
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BusinessProfile } from '../../merchants/entities/business-profile.entity';
import { Review } from './review.entity';
import { Coupon } from './coupon.entity';
<<<<<<< HEAD
import { Category } from '../../../../../modules/apps/categories/entities/category.entity';
=======
import { Category } from 'src/modules/apps/categories/entities/category.entity';
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
import { ProductStatuses } from '../enums/product.enum';

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

  @ManyToOne(
    () => BusinessProfile,
    (businessProfile) => businessProfile.products,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  business: BusinessProfile;

  @Column({ nullable: true })
  @Index()
  businessId: string;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: true })
  actual_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 5, nullable: true })
  discounted_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  discount: number;

  @Column('json', { nullable: true })
  images: { url: string; alt?: string; type?: string }[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  specification: object[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  weight: string;

  @Column({ type: 'json', nullable: true })
  color: object[];

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  hasWarranty: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  warranty: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  erpItemCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  erpSKUNumber: string;

  @Column({ type: 'text', unique: true })
  @Index()
  slug: string;

  @Column({
    type: 'enum',
    enum: ProductStatuses,
    default: ProductStatuses.IN_REVIEW,
  })
  status: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    default: 0,
  })
  commission: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  commissionPercentage: number;

  @ManyToMany(() => Coupon, (coupon) => coupon.products)
  @JoinTable()
  coupons: Coupon[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
