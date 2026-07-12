import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { ErpNextService } from '../../../../erpnext/services/erpnext.service';

@Processor('Rancho Products')
export class ProductsSyncProcessor extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly erpNextService: ErpNextService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      await this.erpNextService.createProduct(job.data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    // do some stuff
  }
}
