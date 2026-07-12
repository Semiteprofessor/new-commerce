import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../db/entity/base.entity';
import { SystemWalletType } from '../enums/transaction.enum';

@Entity('system_wallets')
export class SystemWallet extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: SystemWalletType })
  type: SystemWalletType;

  @Column({ type: 'float', default: 0 })
  balance: number;
}
