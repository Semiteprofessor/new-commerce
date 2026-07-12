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
import { SlackService } from 'src/modules/notifications/services/slack.service';
import { ReturnsSyncProcessor } from './processors/erpnext/erpnext-return.processor';
import { ShopProcessor } from './processors/3xg/shop.processor';

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
      name: `Rancho Shop`,
    }),
    BullModule.registerQueue({
      name: `Rancho Users`,
    }),
    BullModule.registerQueue({
      name: 'Rancho Products',
    }),
    BullModule.registerQueue({
      name: 'Rancho Orders',
    }),
    BullModule.registerQueue({
      name: 'Rancho Returns',
    }),
    BullModule.registerQueue({
      name: 'Rancho Webhooks',
    }),
    BullBoardModule.forFeature(
      {
        name: 'Rancho Shop',
        adapter: BullMQAdapter,
      },
      {
        name: 'Rancho Users',
        adapter: BullMQAdapter,
      },
      {
        name: 'Rancho Products',
        adapter: BullMQAdapter,
      },
      {
        name: 'Rancho Orders',
        adapter: BullMQAdapter,
      },
      {
        name: 'Rancho Returns',
        adapter: BullMQAdapter,
      },
      {
        name: 'Rancho Webhooks',
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
