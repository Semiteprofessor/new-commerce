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
    IamModule,
    UserModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AppInterceptor }],
  exports: [],
})
export class AppModule {}
