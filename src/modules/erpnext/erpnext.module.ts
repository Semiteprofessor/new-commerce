import { Module } from '@nestjs/common';
import { ErpNextService } from './services/erpnext.service';

@Module({
  imports: [ProductModule, OrderModule],
  providers: [ErpNextService],
  exports: [ErpNextService],
})
export class ErpnextModule {}
