import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { ErpNextService } from 'src/modules/erpnext/services/erpnext.service';

@Processor('Rancho Users')
export class UsersSyncProcessor extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly erpNextService: ErpNextService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      switch (job.name) {
        case 'create-user':
          await this.erpNextService.createUser(job.data.user);
          break;

        case 'create-merchant':
          await this.erpNextService.createMerchant(
            job.data.user,
            job.data.business,
          );
          break;

        case 'subscribe-to-newsletter':
          await this.erpNextService.subOrUnSubscribeToNewsletter(job.data);
          break;
        default:
          console.warn(`Unknown job: ${job.name}`);
          return;
      }

      console.log(`Processed job: ${job.name}`);
      return;
    } catch (e) {
      console.error(`Error processing job ${job.name}:`, e);
      throw e;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    // do some stuff
  }
}
