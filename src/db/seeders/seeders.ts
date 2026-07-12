
import { NestFactory } from '@nestjs/core';
import { getMetadataArgsStorage } from 'typeorm';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  const seedService = app.get(SeederService);

  await seedService.seedEscrowSystemWallet();
  await seedService.runSectionCategoriesBrandsSeeder();
  await app.close();
}

bootstrap();
