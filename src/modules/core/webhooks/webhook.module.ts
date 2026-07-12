import { Module } from '@nestjs/common';
import { WalletModule } from '../../apps/wallet/wallet.module';
import { UserModule } from '../users/user.module';
import { ReturnRequestService } from 'src/modules/apps/shop/order/services/return-request.service';
import { ReturnRequestRepository } from 'src/modules/apps/shop/order/repositories/return-request.repository';
import { OrderModule } from 'src/modules/apps/shop/order/order.module';
import { ProductModule } from 'src/modules/apps/shop/products/product.module';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';
import { PaystackService } from 'src/modules/common/payments/paystack.service';

@Module({
  imports: [WalletModule, ProductModule, UserModule, OrderModule],
  controllers: [WebhookController],
  providers: [WebhookService, PaystackService],
})
export class WebhookModule {}
