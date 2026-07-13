import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './modules/app.module';

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
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_, methodKey: string) => methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('3xg Api Documentation')
    .setDescription('Apis for useflota app')
    .addServer('https://3xg.africa', 'Staging Server')
    .addServer('http://localhost:3000', 'Local Server')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: '3xg-auth',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = Number(process.env.PORT) || 5001;

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8002',
    'https://staging-merchant.3xg.africa',
    'https://staging-shop.3xg.africa',
  ];

  app.enableCors({
  origin: (origin, callback) => {
    console.log("Origin:", origin);

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked:", origin);
    callback(new Error("Not allowed by CORS"));
  },
    // origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(PORT, () => {
    console.log(`Api is running on port http://localhost:${PORT}`);
  });
}

bootstrap();
