import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '../users/entities/user.entity';

export class ErpnextQueueService {
  constructor(
    @InjectQueue('Rancho Users') private readonly erpUsersQueue: Queue,
    @InjectQueue('Rancho Products') private readonly erpProductQueue: Queue,
    @InjectQueue('Rancho ErpNext Orders')
    private readonly erpOrdersQueue: Queue,
    @InjectQueue('Rancho ErpNext Returns')
    private readonly erpReturnsQueue: Queue,
  ) {}

  async enqueueCreateErpNextUser(user: User) {
    try {
      await this.erpUsersQueue.add(
        'create-user',
        { user },
        {
          removeOnFail: false,
          removeOnComplete: false,
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
