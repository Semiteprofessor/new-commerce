import { Module } from "@nestjs/common";
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        BullBoardModule.forRoot({
            route: "/queues",
            adapter: ExpressAdapter
        }),

        ConfigModule.forRoot({ cache: true, isGlobal: true, load: [appC]})
    ]
})