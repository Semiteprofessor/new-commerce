import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils.service';
import { UtilsController } from './controller/utils.controller';

@Module({
  // imports:
  providers: [UtilsService],
  controllers: [UtilsController],
})
export class UtilsModule {}
