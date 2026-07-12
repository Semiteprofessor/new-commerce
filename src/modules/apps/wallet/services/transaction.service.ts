import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { ActorUser } from '../../../common/types/user.types';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../enums/transaction.enum';
import { QueryParamsDto } from 'src/modules/common/dtos/pagination.dto';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async getUserTransactionHistory(actor: ActorUser, query: QueryParamsDto) {
    const wallet = await this.walletRepository.findOne({ userId: actor.id });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    query.toWalletId = wallet.id;
    query.fromWalletId = wallet.id;

    const transactions =
      await this.transactionRepository.findAllByQueryBuilder(query);

    let mappedTransactions = transactions.data.map((transaction) => ({
      ...transaction,
      tag: transaction.toWalletId === wallet.id ? 'credit' : 'debit',
    }));

    return { data: mappedTransactions, pageInfo: transactions.pageInfo };
  }

  async getTransactionHistory(id: string) {
    const transaction = await this.transactionRepository.findOne(
      { id },
      { relations: { order: { items: true, user: true } } },
    );
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async getTransactionDetailsByOrderId(orderId: string) {
    const transaction = await this.transactionRepository.findOne(
      { orderId },
      {
        relations: {
          order: { items: { product: true }, user: true },
        },
      },
    );
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }
}
