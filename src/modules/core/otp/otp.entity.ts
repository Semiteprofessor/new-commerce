import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../db/entity/base.entity';
import { ManyToOne } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity()
export class Otps extends BaseEntity {
  @Column({ type: 'varchar', length: 6 })
  otp: string;

  @Column({ type: 'timestamptz' })
  expiry: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'varchar', nullable: true })
  purpose: string; // e.g., 'registration', 'password_reset'

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;
}
