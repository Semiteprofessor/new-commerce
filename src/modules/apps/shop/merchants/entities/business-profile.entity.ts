import { BaseEntity } from 'src/db/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
}
