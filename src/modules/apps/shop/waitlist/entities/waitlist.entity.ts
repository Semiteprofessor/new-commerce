import { BaseEntity } from '../../../../../db/entity/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('waitlist')
export class Waitlist extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ unique: true })
  email: string;
}
