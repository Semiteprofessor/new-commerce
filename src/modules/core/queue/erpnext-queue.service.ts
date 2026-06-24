import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '../users/entities/user.entity';
import { Product } from 'src/modules/apps/shop/products/entities/product.entity';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';

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
  async enqueueCreateErpNextMerchant(user: User, business: BusinessProfile) {
    try {
      await this.erpUsersQueue.add(
        'create-merchant',
        { user, business },
        { removeOnFail: false, removeOnComplete: true },
      );
    } catch (e) {
      console.log(e);
    }
  }

  async enqueueCreateErpNextProduct(product: Product) {
    try {
      await this.erpProductsQueue.add('create-product', product, {
        removeOnFail: false,
        removeOnComplete: false,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
