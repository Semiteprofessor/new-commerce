import { Module } from '@nestjs/common';
import { AssetsController } from './controllers/assets.controller';
import { S3Service } from './pipes/services/s3.service';
import { AssetsService } from './pipes/services/assets.service';

@Module({
  imports: [],
  controllers: [AssetsController],
  providers: [S3Service, AssetsService],
})
export class AssetsModule {}
