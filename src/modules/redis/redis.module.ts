import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST', '172.31.29.4');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const password = configService.get<string>(
          'REDIS_PASSWORD',
          'mysecretpassword',
        );
        return new Redis({ host, port, password });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
