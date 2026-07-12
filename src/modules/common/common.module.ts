import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Global()
@Module({})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
