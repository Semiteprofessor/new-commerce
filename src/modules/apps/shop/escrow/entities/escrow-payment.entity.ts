import { BaseEntity } from '../../../../../db/entity/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { EscrowStatus } from '../enum/escrow.enum';
import { User } from '../../../../../modules/core/users/entities/user.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { Transaction } from '../../../../../modules/apps/wallet/entities/transaction.entity';

@Entity('escrow_payments')
export class EscrowPayment extends BaseEntity {
  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: EscrowStatus, default: EscrowStatus.HELD })
  status: EscrowStatus;

  @Column({ type: 'timestamp' })
  releaseDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt: Date;

  @Column({ nullable: true })
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({ nullable: true })
  merchantId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'merchantId' })
  merchant: User;

  @Column({ nullable: true })
  orderItemId: string;

  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column({ nullable: true })
  releaseTransactionId: string;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'releaseTransactionId' })
  releaseTransaction: Transaction;
}
