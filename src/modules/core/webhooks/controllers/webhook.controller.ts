import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../iam/authentication/decorator/auth.decorator';
import { AuthType } from '../../iam/authentication/enums/auth-type.enum';
import { WebhookService } from '../services/webhook.service';

@Auth(AuthType.None)
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('erp-next')
  async handleErpNextWebhook(
    @Body() payload: { event: string; data: any; reason?: any },
  ) {
    // Process the webhook event
    await this.webhookService.processErpNextWebhook(payload);

    return { success: true, message: 'Webhook received  ✅' };
  }

  @Post('paystack')
  async handlePaystackWebhook(
    @Body() payload: { event: string; data: any; reason?: any },
  ) {
    await this.webhookService.procesPaystackWebhook(payload);
    return { success: true, message: 'Webhook received  ✅' };
  }
}
