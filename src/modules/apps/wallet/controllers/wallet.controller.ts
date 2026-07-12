import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from '../../../core/iam/decorators/active-user.decorator';
import { ActorUser } from '../../../common/types/user.types';
import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import { InitiateFundingDto } from '../dto/wallet.dto';
import { AuthType } from 'src/modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from 'src/modules/core/iam/authentication/decorator/auth.decorator';
import { QueryParamsDto } from 'src/modules/common/dtos/pagination.dto';

@Controller('v1/wallets')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly txnService: TransactionService,
  ) {}

  @Post('initiate')
  async initiateFundingTxn(
    @ActiveUser() actor: ActorUser,
    @Body() data: InitiateFundingDto,
  ) {
    return await this.walletService.initiateWalletFunding(actor.id, data);
  }

  @Get('balance')
  @ApiBearerAuth('')
  @ApiOperation({ summary: 'Get current user wallet balance' })
  @ApiResponse({
    status: 200,
    description: 'Returns the wallet balance',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 125.5 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getMyBalance(@ActiveUser() actor: ActorUser) {
    return await this.walletService.getBalance(actor);
  }

  @Get('transactions')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user transactions' })
  async getUserTransactions(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ) {
    return await this.txnService.getUserTransactionHistory(actor, query);
  }

  @Get('transactions/:id')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a transaction' })
  async getTransaction(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
  ) {
    return await this.txnService.getTransactionHistory(id);
  }

  @Get('transactions/order-receipt/:orderId')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a transaction' })
  async getTransactionReceiptForOrder(
    @ActiveUser() actor: ActorUser,
    @Param('orderId') orderId: string,
  ) {
    return await this.txnService.getTransactionDetailsByOrderId(orderId);
  }
}
