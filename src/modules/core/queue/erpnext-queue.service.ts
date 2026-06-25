import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export class ErpnextQueueService {
  constructor(
    @InjectQueue('Rancho Users') private readonly erpUserQueue: Queue,
    @InjectQueue('Rancho Products') private readonly erpProductQueue: Queue,
    @InjectQueue('Rancho ErpNext Orders')
    private readonly erpOrdersQueue: Queue,
    @InjectQueue('Rancho ErpNext Returns')
    private readonly erpReturnsQueue: Queue,
  ) {}
}
