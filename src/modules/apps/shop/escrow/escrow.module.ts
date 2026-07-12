import { Module } from '@nestjs/common';
import { OrderRepository } from '../order/repositories/order.repository';
import { Order } from '../order/entities/order.entity';
import { SystemWalletRepository } from '../../wallet/repositories/system-wallet.repository';
import { SystemWallet } from '../../wallet/entities/system-wallets.entity';
import { TransactionRepository } from '../../wallet/repositories/transaction.repository';
import { Transaction } from '../../wallet/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrowPayment } from './entities/escrow-payment.entity';
import { EscrowRepository } from './repositories/escrow.repository';
import { EscrowService } from './services/escrow.service';
import { AppLoggerService } from '../../../../modules/core/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EscrowPayment, Order, SystemWallet, Transaction]),
  ],
  providers: [
    EscrowRepository,
    EscrowService,
    AppLoggerService,
    OrderRepository,
    SystemWalletRepository,
    TransactionRepository,
  ],
  exports: [EscrowService],
})
export class EscrowModule {}
