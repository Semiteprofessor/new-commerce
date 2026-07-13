import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { IamModule } from './core/iam/iam.module';
import appConfig from './config/app.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { NotificationModule } from './notifications/modules/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilsModule } from './utils/utils.module';
import { ShopModule } from './apps/shop/shop.module';
import { UtilityModule } from './apps/lib/utility/utility.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { QueueModule } from './core/queue/queue.module';
import { WebhookModule } from './core/webhooks/webhook.module';
import { WalletModule } from './apps/wallet/wallet.module';
import { LoggerModule } from './core/logger/logger.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './core/users/user.module';
import { AssetsModule } from './assets/assets.module';
import { CategoriesModule } from './apps/categories/category.module';
import { AppInterceptor } from './common/interceptors/app.interceptor';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),

    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),

    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    }),

    IamModule,
    UserModule,
    EventEmitterModule.forRoot(),
    CommonModule,
    AssetsModule,
    NotificationModule,
    QueueModule,
    RedisModule,
    UtilsModule,
    CategoriesModule,
    UtilityModule,
    ShopModule,
    WebhookModule,
    WalletModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AppInterceptor }],
  exports: [],
})
export class AppModule {}
