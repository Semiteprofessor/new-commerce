import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppEvents } from '../../common/app.events';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('3xg Shop') private readonly _3xgShopQueue: Queue) {}

  async enqueueSlackNotificationForOrders(data: any) {
    await this._3xgShopQueue.add(AppEvents.NEW_ORDER_CREATED, data);
  }

  async enqueueSlackNotificationForReturnRequests(data: any) {
    await this._3xgShopQueue.add(AppEvents.RETURN_REQUEST_SUBMITTED, data);
  }
}
