import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ErpNextService } from 'src/modules/erpnext/services/erpnext.service';

@Processor('Rancho Product')
export class ProductsSyncProcessor extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly erpNextService: ErpNextService,
  ) {
    super();
  }

  
}
