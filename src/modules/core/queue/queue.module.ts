<<<<<<< HEAD
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
=======
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { UsersSyncProcessor } from './processors/erpnext/erpnext-user.processor';
import { ErpnextQueueService } from './erpnext-queue.service';
import { ErpnextModule } from 'src/modules/erpnext/erpnext.module';
import { ProductsSyncProcessor } from './processors/erpnext/erpnext-product.processor';
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
<<<<<<< HEAD
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
          password: configService.get<string>('REDIS_PASSWORD'),
=======
      useFactory: async (ConfigService: ConfigService) => ({
        connection: {
          host: ConfigService.get<string>('REDIS_HOST'),
          port: Number(ConfigService.get<number>('REDIS_PORT')),
          password: ConfigService.get<string>('REDIS_PASSWORD'),
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
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
<<<<<<< HEAD
      name: 'Rancho Orders',
    }),
    BullModule.registerQueue({
      name: 'Rancho Returns',
=======
      name: 'Rancho ErpNext Orders',
    }),
    BullModule.registerQueue({
      name: 'Rancho ErpNext Returns',
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
    }),
    BullModule.registerQueue({
      name: 'Rancho Webhooks',
    }),
<<<<<<< HEAD
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
=======
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
    ErpnextModule,
  ],
  providers: [
    QueueService,
    UsersSyncProcessor,
    ProductsSyncProcessor,
<<<<<<< HEAD
    ShopProcessor,
    OrdersSyncProcessor,
    ReturnsSyncProcessor,
    ErpnextQueueService,
    SlackService,
=======
    // ShopProcessor,
    // OrdersSyncProcessor,
    // ReturnsSyncProcessor,
    ErpnextQueueService,
    // SlackService,
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
  ],
  exports: [ErpnextQueueService, QueueService],
})
export class QueueModule {}
