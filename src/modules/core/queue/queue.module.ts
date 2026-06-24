import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (ConfigService: ConfigService) => ({
                connection: {
                    host: ConfigService.get<string>("REDIS_HOST"),
                    port: Number(ConfigService.get<number>("REDIS_PORT")),
                    password: configService.get<string>('REDIS_PASSWORD'),
                }
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
    ]
})