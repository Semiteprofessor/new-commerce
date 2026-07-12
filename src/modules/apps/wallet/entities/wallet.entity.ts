import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  Check,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../../core/users/entities/user.entity';
import { BaseEntity } from '../../../../db/entity/base.entity';

@Entity('wallets')
@Unique(['userId'])
// @Check(`"balance" >= 0`)
// @Check(`"totalCredit" >= 0`)
// @Check(`"totalDebit" >= 0`)
export class Wallet extends BaseEntity {
  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ type: 'float', default: 0 })
  totalCredit: number;

  @Column({ type: 'float', default: 0 })
  totalDebit: number;

  @Column({ type: 'uuid', unique: true })
  @Index()
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
