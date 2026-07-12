import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email.module';
import { PushService } from '../services/push.service';
import { NotificationService } from '../services/notification.service';

@Global()
@Module({
  imports: [EmailModule],
  providers: [NotificationService, PushService],
  exports: [NotificationService],
})
export class NotificationModule {}
