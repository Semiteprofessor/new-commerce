import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'auth/google', method: RequestMethod.GET },
      { path: 'auth/google/callback', method: RequestMethod.GET },
    ],
  });

  /**
   * Swagger Configuration
   */
  const options: SwaggerDocumentOptions = {};
}
bootstrap();
