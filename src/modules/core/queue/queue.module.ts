import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { UsersSyncProcessor } from './processors/erpnext/erpnext-user.processor';
import { ErpnextQueueService } from './erpnext-queue.service';
import { ErpnextModule } from 'src/modules/erpnext/erpnext.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        connection: {
          host: ConfigService.get<string>('REDIS_HOST'),
          port: Number(ConfigService.get<number>('REDIS_PORT')),
          password: ConfigService.get<string>('REDIS_PASSWORD'),
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
    ErpnextModule,
  ],
  providers: [
    QueueService,
    UsersSyncProcessor,
    // ProductsSyncProcessor,
    // ShopProcessor,
    // OrdersSyncProcessor,
    // ReturnsSyncProcessor,
    // ErpnextQueueService,
    // SlackService,
  ],
  exports: [ErpnextQueueService, QueueService],
})
export class QueueModule {}
