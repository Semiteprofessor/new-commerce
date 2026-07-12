import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from 'src/db/repository/entity.repository';
import { Transaction } from '../entities/transaction.entity';
import {
  PageInfo,
  PaginatedRecordsDto,
  QueryParamsDto,
} from 'src/modules/common/dtos/pagination.dto';

@Injectable()
export class TransactionRepository extends EntityRepository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly txnRepository: Repository<Transaction>,
  ) {
    super(txnRepository);
  }

  async findAllByQueryBuilder(
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Transaction>> {
    const {
      sortOrder,
      startsAt,
      endsAt,
      sortBy,
      limit,
      page,
      status,
      type,
      fromWalletId,
      toWalletId,
      minAmount,
      maxAmount,
    } = query;

    const txnQuery = this.txnRepository
      .createQueryBuilder('transactions')
      .where('transactions.deletedAt IS NULL');

    if (status) {
      txnQuery.andWhere('transactions.status = :status', { status });
    }

    if (type) {
      txnQuery.andWhere('transactions.type = :type', { type });
    }

    if (fromWalletId || toWalletId) {
      txnQuery.andWhere(
        '(transactions.fromWalletId = :fromWalletId OR transactions.toWalletId = :toWalletId)',
        { fromWalletId, toWalletId },
      );
    }

    if (minAmount && maxAmount) {
      txnQuery.andWhere(
        'transactions.amount BETWEEN :minAmount AND :maxAmount',
        {
          minAmount,
          maxAmount,
        },
      );
    }

    if (startsAt && endsAt) {
      txnQuery.andWhere(
        'transactions.createdAt BETWEEN :startsAt AND :endsAt',
        {
          startsAt,
          endsAt,
        },
      );
    }

    const totalCount = await txnQuery.clone().getCount();

    txnQuery
      .orderBy(`transactions.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const data = await txnQuery.getMany();

    const pageInfo: PageInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return { data, pageInfo };
  }
}
