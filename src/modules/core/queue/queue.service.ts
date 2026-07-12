import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppEvents } from '../../common/app.events';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('Rancho Shop') private readonly _ranchoShopQueue: Queue) {}

  async enqueueSlackNotificationForOrders(data: any) {
    await this._ranchoShopQueue.add(AppEvents.NEW_ORDER_CREATED, data);
  }

  async enqueueSlackNotificationForReturnRequests(data: any) {
    await this._ranchoShopQueue.add(AppEvents.RETURN_REQUEST_SUBMITTED, data);
  }
}
