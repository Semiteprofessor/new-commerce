import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { UsersSyncProcessor } from './processors/erpnext/erpnext-user.processor';
import { ErpnextQueueService } from './erpnext-queue.service';
import { ErpnextModule } from 'src/modules/erpnext/erpnext.module';
import { ProductsSyncProcessor } from './processors/erpnext/erpnext-product.processor';

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
      name: `Rancho Shop`,
    }),
    BullModule.registerQueue({
      name: `Rancho Users`,
    }),
    BullModule.registerQueue({
      name: 'Rancho Products',
    }),
    BullModule.registerQueue({
      name: 'Rancho ErpNext Orders',
    }),
    BullModule.registerQueue({
      name: 'Rancho ErpNext Returns',
    }),
    BullModule.registerQueue({
      name: 'Rancho Webhooks',
    }),
    ErpnextModule,
  ],
  providers: [
    QueueService,
    UsersSyncProcessor,
    ProductsSyncProcessor,
    // ShopProcessor,
    // OrdersSyncProcessor,
    // ReturnsSyncProcessor,
    ErpnextQueueService,
    // SlackService,
  ],
  exports: [ErpnextQueueService, QueueService],
})
export class QueueModule {}
