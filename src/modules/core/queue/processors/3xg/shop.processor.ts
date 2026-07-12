import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SlackService } from '../../../../notifications/services/slack.service';

@Processor('3xg Shop')
export class ShopProcessor extends WorkerHost {
  constructor(private readonly slackService: SlackService) {
    super();
  }
  async process(job: Job, token: string | undefined): Promise<any> {
    await this.slackService.send(job.data);
    return;
  }
}
