import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { ErpNextService } from 'src/modules/erpnext/services/erpnext.service';

<<<<<<< HEAD
@Processor('Rancho Products')
=======
@Processor('Rancho Product')
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
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
