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
}
