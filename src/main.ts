import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())

  const configServer = app.get(ConfigService)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
