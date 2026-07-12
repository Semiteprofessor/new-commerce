import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../../core/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { SystemWallet } from './entities/system-wallets.entity';
import { OrderModule } from '../shop/order/order.module';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { WalletRepository } from './repositories/wallet.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { SystemWalletRepository } from './repositories/system-wallet.repository';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction, SystemWallet]),
    UserModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletRepository,
    TransactionRepository,
    SystemWalletRepository,
    TransactionService,
  ],
  exports: [WalletRepository, WalletService],
})
export class WalletModule {}
