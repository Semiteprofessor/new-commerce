import { BaseEntity } from '../../../../../db/entity/base.entity';
import { User } from '../../../../../modules/core/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../../../categories/entities/category.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { BusinessProfile } from '../../merchants/entities/business-profile.entity';
import { Coupon } from './coupon.entity';
import { ProductStatuses } from '../enums/product.enum';
import { Review } from './review.entity';

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
