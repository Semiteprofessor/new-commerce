import { Module } from '@nestjs/common';
import { ErpNextService } from './services/erpnext.service';
import { OrderModule } from '../apps/shop/order/order.module';

@Module({
  imports: [ProductModule, OrderModule],
  providers: [ErpNextService],
  exports: [ErpNextService],
})
export class ErpnextModule {}
