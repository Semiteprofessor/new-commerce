import { Injectable } from '@nestjs/common';
import { EscrowStatus } from '../enum/escrow.enum';
import { EscrowPayment } from '../entities/escrow-payment.entity';
import { DataSource, In, LessThanOrEqual } from 'typeorm';
import {
  SystemWalletType,
  TransactionStatus,
  TransactionType,
} from '../../../../../modules/apps/wallet/enums/transaction.enum';
import { Transaction } from '../../../../../modules/apps/wallet/entities/transaction.entity';
import { SystemWallet } from '../../../../../modules/apps/wallet/entities/system-wallets.entity';
import { endOfDay } from 'date-fns/endOfDay';
import { Wallet } from '../../../../../modules/apps/wallet/entities/wallet.entity';
import { addDaysToDateObject } from '../../../../../modules/common/helpers/data.helper';
import { nairaToKobo } from '../../../../../modules/common/helpers/number.helper';
import { AppEvents } from '../../../../../modules/common/app.events';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AppLoggerService,
  ContextLogger,
} from '../../../../../modules/core/logger/logger.service';
import { SystemWalletRepository } from '../../../../../modules/apps/wallet/repositories/system-wallet.repository';
import { OrderRepository } from '../../order/repositories/order.repository';
import { EscrowRepository } from '../repositories/escrow.repository';
import { OrderItem } from '../../order/entities/order-item.entity';

interface MerchantItemsMap {
  [merchantId: string]: OrderItem[];
}

interface MerchantEscrowMap {
  [merchantId: string]: { total: number; escrows: EscrowPayment[] };
}

@Injectable()
export class EscrowService {
  private logger: ContextLogger;

  constructor(
    private escrowRepository: EscrowRepository,
    private readonly orderRepository: OrderRepository,
    private readonly systemWalletRepository: SystemWalletRepository,
    private loggerService: AppLoggerService,
    private dataSource: DataSource,
  ) {
    this.logger = this.loggerService.getLogger(EscrowService.name);
  }

  /**
   * Create escrow payments after a customer pays for an order
   *
   */
  @OnEvent(AppEvents.ORDER_PAYMENT_PROCESSED, { async: true })
  async createEscrowPayments(data: {
    orderId: string;
    transactionId: string;
  }): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { orderId, transactionId } = data;

    try {
      const order = await this.orderRepository.findOne(
        { id: orderId },
        { relations: { items: { merchant: true } } },
      );

      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
      });
      const escrowWallet = await queryRunner.manager.findOne(SystemWallet, {
        where: { type: SystemWalletType.PLATFORM_ESCROW },
      });

      // if (!order || !transaction || !escrowWallet) {
      //   throw new Error('Required entities not found');
      // }

      const merchantItemsMap: MerchantItemsMap = order.items.reduce(
        (acc, item) => {
          const merchantId = item.merchant.id;
          if (!acc[merchantId]) {
            acc[merchantId] = [];
          }
          acc[merchantId].push(item);
          return acc;
        },
        {},
      );

      for (const [merchantId, items] of Object.entries(merchantItemsMap)) {
        const merchantTotal = items.reduce(
          (sum, item) => sum + parseFloat(String(item.price)) * item.qty,
          0,
        );

        /**
         * Create escrow record for each merchant's portion
         *  (used for future analytics)
         */
        const escrow = new EscrowPayment();
        escrow.amount = nairaToKobo(merchantTotal);
        escrow.merchantId = merchantId;
        escrow.status = EscrowStatus.HELD;
        escrow.transactionId = transaction.id;
        escrow.releaseDate = addDaysToDateObject(new Date(), 7);

        for (const item of items) {
          const itemEscrow = new EscrowPayment();
          itemEscrow.amount = nairaToKobo(item.price * item.qty);
          itemEscrow.merchantId = merchantId;
          itemEscrow.orderItemId = item.id;
          itemEscrow.status = EscrowStatus.HELD;
          itemEscrow.transactionId = transaction.id;
          itemEscrow.releaseDate = addDaysToDateObject(new Date(), 7);

          await queryRunner.manager.save(itemEscrow);
        }
        await queryRunner.manager.save(escrow);
      }

      escrowWallet.balance += transaction.amount;
      await queryRunner.manager.save(escrowWallet);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processEscrowReleases(): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dueEscrows = await this.escrowRepository.find(
        {
          status: EscrowStatus.HELD,
          releaseDate: LessThanOrEqual(endOfDay(new Date(2025, 3, 1))),
        },
        { relations: { merchant: true } },
      );

      let itemEscroRecords = [];

      const merchantEscrowMap: MerchantEscrowMap = dueEscrows.reduce(
        (acc, escrow) => {
          if (!escrow.orderItemId) {
            if (!acc[escrow.merchantId]) {
              acc[escrow.merchantId] = {
                total: 0,
                escrows: [],
              };
            }
            acc[escrow.merchantId].total += escrow.amount;
            acc[escrow.merchantId].escrows.push(escrow);
          } else {
            itemEscroRecords.push(escrow.id);
          }
          return acc;
        },
        {},
      );

      const escrowWallet = await queryRunner.manager.findOne(SystemWallet, {
        where: { type: SystemWalletType.PLATFORM_ESCROW },
      });

      // Process each merchant's escrow releases
      for (const [merchantId, data] of Object.entries(merchantEscrowMap)) {
        const { total, escrows } = data;

        const merchantWallet = await queryRunner.manager.findOne(Wallet, {
          where: { userId: merchantId },
        });

        if (!merchantWallet) {
          continue;
        }

        const releaseTransaction = new Transaction();
        releaseTransaction.amount = total;
        releaseTransaction.type = TransactionType.ESCROW_RELEASE;
        releaseTransaction.status = TransactionStatus.COMPLETED;
        releaseTransaction.toWalletId = merchantWallet.id;
        releaseTransaction.reference = `escrow-release-${crypto.randomUUID()}`;
        releaseTransaction.description = `Release of escrow funds `;

        await queryRunner.manager.save(releaseTransaction);

        escrowWallet.balance -= total;
        await queryRunner.manager.save(escrowWallet);

        merchantWallet.balance += total;
        await queryRunner.manager.save(merchantWallet);

        // Update all escrow records (totals)
        for (const escrow of escrows) {
          escrow.status = EscrowStatus.RELEASED;
          escrow.releasedAt = new Date();
          escrow.releaseTransactionId = releaseTransaction.id;
          await queryRunner.manager.save(escrow);
        }
      }

      await queryRunner.manager.update(
        EscrowPayment,
        { id: In(itemEscroRecords) },
        {
          status: EscrowStatus.RELEASED,
          releasedAt: new Date(),
        },
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMerchantPendingEscrow(merchantId: string): Promise<any> {
    const escrows = await this.escrowRepository.find(
      {
        merchantId,
        status: EscrowStatus.HELD,
      },
      {
        relations: { orderItem: { order: true } },
      },
    );

    // Group by release date
    const groupedByDate = escrows.reduce((acc, escrow) => {
      const dateKey = escrow.releaseDate.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          releaseDate: escrow.releaseDate,
          totalAmount: 0,
          items: [],
        };
      }

      acc[dateKey].totalAmount += escrow.amount;
      if (escrow.orderItem) {
        acc[dateKey].items.push({
          orderItemId: escrow.orderItemId,
          orderId: escrow.orderItem.order.id,
          amount: escrow.amount,
        });
      }

      return acc;
    }, {});

    return {
      totalPending: escrows.reduce((sum, escrow) => sum + escrow.amount, 0),
      pendingByDate: Object.values(groupedByDate),
    };
  }

  //   /**
  //    * Handle disputed or cancelled orders - admin initiated
  //    */
  //   async cancelEscrowPayment(escrowId: string, reason: string): Promise<void> {
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //
  //     try {
  //       const escrow = await this.escrowRepository.findOne({
  //         where: { id: escrowId },
  //         relations: ['transaction']
  //       });
  //
  //       if (!escrow || escrow.status !== EscrowStatus.HELD) {
  //         throw new Error('Escrow payment not found or already processed');
  //       }
  //
  //       // Update escrow status
  //       escrow.status = EscrowStatus.CANCELLED;
  //       escrow.metadata = {
  //         ...escrow.metadata,
  //         cancellationReason: reason,
  //         cancelledAt: new Date()
  //       };
  //
  //       await queryRunner.manager.save(escrow);
  //
  //       // Handle refund logic here
  //       // This would involve creating refund transactions and
  //       // updating wallet balances appropriately
  //
  //       await queryRunner.commitTransaction();
  //     } catch (error) {
  //       await queryRunner.rollbackTransaction();
  //       throw error;
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   }
}
