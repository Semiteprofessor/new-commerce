import { Entity, Column, Index, OneToMany } from 'typeorm';
import { UserStatus } from '../../../common/enums/role.enum';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../../db/entity/base.entity';
import { BusinessProfile } from '../../../apps/shop/merchants/entities/business-profile.entity';

import { Order } from 'src/modules/apps/shop/order/entities/order.entity';

import { Cart } from 'src/modules/apps/shop/cart/entities/cart.entity';
import { Wishlist } from '../../../apps/shop/wishlist/entities/wishlist.entity';
import { ShippingAddress } from 'src/modules/apps/shop/order/entities/shipping-address.entity';
import { Warranty } from 'src/modules/apps/shop/warranty/entities/warranty.entity';
import { ReturnRequest } from 'src/modules/apps/shop/order/entities/return-request.entity';
import { Review } from 'src/modules/apps/shop/products/entities/review.entity';

@Entity('users')
@Index(['email', 'role'], { unique: true })
@Index(['phone', 'phone2'])
@Index(['role'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, unique: true, length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middleName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255 })
  email?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
    default: 'PLACEHOLDER_PASSWORD',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => BusinessProfile, (business) => business.owner, {
    nullable: true,
  })
  businesses?: BusinessProfile;

  @Column({ type: 'varchar', nullable: true })
  countryCode: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', nullable: true })
  profilePhoto?: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone2?: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  gender?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  role?: string;

  @Column({ type: 'varchar', nullable: true })
  region?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fcmToken?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  isActivated: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  carts: Cart[];

  @OneToMany(() => ShippingAddress, (address) => address.user, {
    cascade: true,
  })
  shippingAddresses: ShippingAddress[];

  @OneToMany(() => Wishlist, (ws) => ws.user, { cascade: true })
  wishlists: Wishlist[];

  @OneToMany(() => Warranty, (wr) => wr.user, { cascade: true })
  warranty: Warranty[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  newsLetterMail?: string;

  @Column({ type: 'boolean', default: false })
  subscribedToNewsletter: boolean;

  @OneToMany(() => ReturnRequest, (r) => r.user, { cascade: true })
  returnRequests: ReturnRequest[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
