import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionStatus, TransactionType } from '../enums/transaction.enum';
import { BaseEntity } from '../../../../db/entity/base.entity';
import { Order } from '../../shop/order/entities/order.entity';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'text', unique: true })
  @Index()
  reference: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.PAYMENT,
  })
  type: TransactionType;

  @Column({ nullable: true })
  fromWalletId: string;

  @Column({ nullable: true })
  toWalletId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'fromWalletId' })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'toWalletId' })
  toWallet: Wallet;

  @Column({ type: 'float', nullable: true, default: 0 })
  fee?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  externalReference: string;

  @Column({ nullable: true })
  paymentProvider: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  releaseDate: Date;
}
