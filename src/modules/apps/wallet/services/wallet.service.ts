import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Wallet } from "../entities/wallet.entity";
import { ErrorCodes } from "src/modules/common/error-codes.enum";
import { ActorUser } from "src/modules/common/types/user.types";
import { TransactionStatus, TransactionType } from "../enums/transaction.enum";
import { Transaction } from "../entities/transaction.entity";
import { koboToNaira, nairaToKobo } from "src/modules/common/helpers/number.helper";
import { AppEvents } from "src/modules/common/app.events";
import { OrderStatus } from "../../shop/order/enums/order.enum";
import { Order } from "../../shop/order/entities/order.entity";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InitiateFundingDto, PaymentType } from "../dto/wallet.dto";
import { WalletRepository } from "../repositories/wallet.repository";
import { UserService } from "src/modules/core/users/services/user.service";
import { TransactionRepository } from "../repositories/transaction.repository";
import { SystemWalletRepository } from "../repositories/system-wallet.repository";
import { OrdersService } from "../../shop/order/services/order.service";
import { DataSource } from "typeorm";

const crypto = require('crypto');

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private usersService: UserService,
    private readonly txnRepository: TransactionRepository,
    private readonly systemWalletRepository: SystemWalletRepository,
    private readonly orderService: OrdersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new wallet for a user
   * @param userId The ID of the user to create a wallet for
   * @returns The newly created wallet
   * @throws Error if the user doesn't exist or already has a wallet
   */
  async createWalletForUser(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const existingWallet = await this.walletRepository.findOne({ userId });

    if (existingWallet) {
      return;
    }

    const wallet = new Wallet();
    wallet.userId = userId;

    await this.walletRepository.create(wallet);
  }

  async getBalance(actor: ActorUser): Promise<{
    balance: number;
    totalCredit: number;
    totalDebit: number;
  } | null> {
    const wallet = await this.walletRepository.findOne({ userId: actor.id });

    if (!wallet) {
      throw new NotFoundException({
        errorCode: ErrorCodes.WALLET_NOT_FOUND,
        message: 'Wallet not found',
      });
    }

    return {
      balance: wallet.balance / 100,
      totalCredit: wallet.totalCredit,
      totalDebit: wallet.totalDebit,
    };
  }

  /**
   * For funding wallet and paying for orders
   * @param userId
   * @param data
   */
  async initiateWalletFunding(
    userId: string,
    data: InitiateFundingDto,
  ): Promise<any> {
    const { amount, type, orderId } = data;

    // Todo: separate into different methods
    if (type == PaymentType.ORDER_PAYMENT) {
      const order = await this.orderService.getSingleOrder(userId, orderId);
      const userWallet = await this.walletRepository.findOne({ userId });

      if (!order) {
        throw new NotFoundException(`Order not found on 3XG`);
      }

      if (order.orderStatus !== OrderStatus.PENDING) {
        throw new ConflictException(`Order already paid for`);
      }

      // if (order.orderStatus === OrderStatus.PENDING) {
      //   return;
      // }

      const reference = `order-payment-${crypto.randomUUID()}`;

      const transaction: Partial<Transaction> = await this.txnRepository.create(
        {
          amount: nairaToKobo(parseFloat(String(order.grandTotal))),
          description: `Order payment via Paystack`,
          reference: reference,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.PENDING,
          orderId: order.id,
          fromWalletId: userWallet.id,
          externalReference: reference,
          paymentProvider: 'paystack',
          metadata: {
            userId,
            email: '',
            initiatedAt: new Date(),
          },
        },
      );

      return {
        transactionId: transaction.id,
        reference,
        amount: koboToNaira(transaction.amount),
        message: 'Order Payment initiation successful',
      };
    } else {
      const wallet = await this.walletRepository.findOne({ userId });

      if (!wallet) {
        throw new NotFoundException(`Wallet not found for user ${userId}`);
      }

      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than zero');
      }

      const reference = `wallet-fund-${crypto.randomUUID()}`;

      const transaction: Partial<Transaction> = await this.txnRepository.create(
        {
          amount: amount * 100,
          description: `Wallet funding via Paystack`,
          reference: reference,
          type: TransactionType.EXTERNAL_DEPOSIT,
          status: TransactionStatus.PENDING,
          toWalletId: wallet.id,
          externalReference: reference,
          paymentProvider: 'paystack',
          metadata: {
            userId,
            email: '',
            initiatedAt: new Date(),
          },
        },
      );

      return {
        transactionId: transaction.id,
        reference,
        message: 'Payment initiation successful',
      };
    }
  }

  async processOrderAfterPayment(transaction: Transaction, paymentData) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Transaction,
          { id: transaction.id },
          {
            status: TransactionStatus.COMPLETED,
            metadata: paymentData,
          },
        );

        await transactionalEntityManager.update(
          Order,
          { id: transaction.orderId },
          {
            transactionId: transaction.id,
            orderStatus: OrderStatus.PROCESSING,
            meta: paymentData,
          },
        );
      },
    );

    // update all order items under the order
    this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_PROCESSED, {
      orderId: transaction.orderId,
      transactionId: transaction.id,
    });
  }

  async fundWalletOrPayForOrder(
    reference: string,
    paymentData: any,
  ): Promise<void> {
    const transaction = await this.txnRepository.findOne({ reference });
    if (!transaction) {
      console.log(`Transation ${reference} does not exist`);
    }
    if (transaction.status === TransactionStatus.COMPLETED) {
      return;
    }

    if (transaction.type === TransactionType.PAYMENT) {
      await this.processOrderAfterPayment(transaction, paymentData);
    } else if (transaction.type === TransactionType.EXTERNAL_DEPOSIT) {
      await this.fundWallet(transaction, paymentData);
    }
  }

  async fundWallet(transaction: Transaction, paymentData) {
    const wallet = await this.walletRepository.findOne({
      id: transaction.toWalletId,
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet not found for transaction ${transaction.id}`,
      );
    }
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Transaction,
          { id: transaction.id },
          {
            status: TransactionStatus.COMPLETED,
            metadata: paymentData,
          },
        );
        // Add the amount to the user's wallet
        await transactionalEntityManager.increment(
          Wallet,
          { id: wallet.id },
          'balance',
          transaction.amount,
        );
      },
    );
  }

  // private async processFailedPayment(transaction: Transaction, paymentData: any): Promise<void> {
  //   // Skip if already processed as failed
  //   if (transaction.status === TransactionStatus.FAILED) {
  //     return;
  //   }
  //
  //   // Update transaction to failed status
  //   await this.transactionRepository.update(
  //     { id: transaction.id },
  //     {
  //       status: TransactionStatus.FAILED,
  //       providerMetadata: paymentData,
  //       metadata: {
  //         ...transaction.metadata,
  //         failedAt: new Date(),
  //         failureReason: paymentData.gateway_response || 'Payment failed'
  //       }
  //     }
  //   );
  //
  //   // Notify the user
  //   const wallet = await this.walletRepository.findOne({
  //     where: { id: transaction.toWalletId }
  //   });
  //
  //   if (wallet) {
  //     await this.notificationService.notifyUser(
  //       wallet.userId,
  //       'wallet_funding_failed',
  //       'Your wallet funding failed',
  //       {
  //         amount: transaction.amount,
  //         reference: transaction.referenceId,
  //         reason: paymentData.gateway_response || 'Payment failed'
  //       }
  //     );
  //   }
  // }

  @OnEvent(AppEvents.CREATE_WALLET)
  async handleCreateWallet(data: { user: any }) {
    try {
      const { user } = data;
      await this.createWalletForUser(user.id);
    } catch (e) {
      console.log(e);
    }
  }
}