import { BaseEntity } from 'src/db/entity/base.entity';
import { User } from 'src/modules/core/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'business_profile' })
export class BusinessProfile extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  businessType: string;

  @Column({ type: 'json', nullable: false })
  businessCategory: string[];

  @Column({ type: 'json', nullable: true })
  businessSection?: string[];

  @Column({ type: 'double precision', nullable: true })
  businessLocationLat?: number;

  @Column({ type: 'double precision', nullable: true })
  businessLocationLong?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankCode?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  document?: string;

  @ManyToOne(() => User, (user) => user.businesses)
  owner: User;

  @OneToMany(() => Product, (product) => product.business)
  products: Product[];
}
