import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './core/iam/iam.module';
import { UserModule } from './core/users/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppInterceptor } from './common/interceptors/app.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { QueueModule } from './core/queue/queue.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

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
    QueueModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AppInterceptor }],
  exports: [],
})
export class AppModule {}
