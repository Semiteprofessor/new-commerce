import { BaseEntity } from '../../../../../db/entity/base.entity';
import { WarrantyStatus } from '../../../../../modules/common/enums/warranty.enum';
import { User } from '../../../../../modules/core/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('warranty')
export class Warranty extends BaseEntity {
  @ManyToOne(() => User, (user) => user.warranty, {
    nullable: false,
    eager: false,
  })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imei?: string;

  @Column({ type: 'varchar', nullable: false })
  brand_model: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  area: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  claimant: string;

  @Column({ type: 'varchar', nullable: false, default: WarrantyStatus.EXPIRED })
  warrantyStatus?: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isWarrantyClaimed: boolean;

  @Column({ type: 'timestamp', nullable: false })
  warrantyExpiryDate?: Date;

  @Column({ type: 'varchar', nullable: false })
  pickupDate?: string;

  @Column({ type: 'varchar', nullable: false })
  pickupTime?: string;

  @Column({ type: 'text', nullable: false })
  deviceIssue: string;

  @Column({ type: 'jsonb', nullable: false })
  claimDetails?: {
    brand_model: string;
    address: string;
    area: string;
    pickupDate: string;
    pickupTime: string;
    deviceIssue: string;
  };
}
