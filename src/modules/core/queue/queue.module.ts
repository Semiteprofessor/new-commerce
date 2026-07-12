import { Global, Module, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QueueService } from './queue.service';
import { UsersSyncProcessor } from './processors/erpnext/erpnext-user.processor';
import { ProductsSyncProcessor } from './processors/erpnext/erpnext-product.processor';
import { ErpnextQueueService } from './erpnext-queue.service';
import { ErpnextModule } from '../../erpnext/erpnext.module';
import { OrdersSyncProcessor } from './processors/erpnext/erpnext-order.processor';
import { SlackService } from '../../notifications/services/slack.service';
import { ShopProcessor } from './processors/3xg/shop.processor';
import { ReturnsSyncProcessor } from './processors/erpnext/erpnext-return.processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: `3xg Shop`,
    }),
    BullModule.registerQueue({
      name: `3xg Users`,
    }),
    BullModule.registerQueue({
      name: '3xg Products',
    }),
    BullModule.registerQueue({
      name: '3xg ErpNext Orders',
    }),
    BullModule.registerQueue({
      name: '3xg ErpNext Returns',
    }),
    BullModule.registerQueue({
      name: '3xg Webhooks',
    }),
    BullBoardModule.forFeature(
      {
        name: '3xg Shop',
        adapter: BullMQAdapter,
      },
      {
        name: '3xg Users',
        adapter: BullMQAdapter,
      },
      {
        name: '3xg Products',
        adapter: BullMQAdapter,
      },
      {
        name: '3xg ErpNext Orders',
        adapter: BullMQAdapter,
      },
      {
        name: '3xg ErpNext Returns',
        adapter: BullMQAdapter,
      },
      {
        name: '3xg Webhooks',
        adapter: BullMQAdapter,
      },
    ),
    ErpnextModule,
  ],
  providers: [
    QueueService,
    UsersSyncProcessor,
    ProductsSyncProcessor,
    ShopProcessor,
    OrdersSyncProcessor,
    ReturnsSyncProcessor,
    ErpnextQueueService,
    SlackService,
  ],
  exports: [ErpnextQueueService, QueueService],
})
export class QueueModule {}
