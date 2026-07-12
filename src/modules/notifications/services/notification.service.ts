import { OnEvent } from '@nestjs/event-emitter';
import { UserEvents } from 'src/modules/common/app.events';
import { EmailService } from './email.service';
import { User } from 'src/modules/core/users/entities/user.entity';
import { firebaseMessage } from '../notification.types';
import { PushService } from './push.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(UserEvents.SEND_OTP_EMAIL, { async: true })
  async sendOtpEmail(payload) {
    console.log('OTP EVENT RECEIVED');
    console.log(payload);
    const { title, message, subject } = payload;
    const template = 'reset-otp',
      _subject = subject ?? 'OTP Verification',
      to = payload.email;

    for (let i = 0; i <= 5; i++) {
      payload[`otp${i + 1}`] = payload.otp.split('')[i];
    }

    payload.verifyUrl = `${this.configService.get<String>('APP_URL')}/onboard/verify-otp?email=${
      payload.email
    }`;

    await this.emailService.sendEmail(to, _subject, template, payload);
  }

  @OnEvent(UserEvents.SEND_WELCOME_MAIL, { async: true })
  async sendWelcomeEmail(payload: User) {
    const template = 'welcome',
      subject = 'Welcome to 3XG Africa',
      to = payload.email;

    await this.emailService.sendEmail(to, subject, template, {
      ...payload,
      dashboardUrl: this.configService.get<String>('APP_URL'),
    });
  }

  @OnEvent(UserEvents.SEND_ORDER_CREATED, { async: true })
  async sendOrderCreatedEmail(payload) {
    const template = 'order-created',
      subject = 'New Order',
      to = payload.email;

    await this.emailService.sendEmail(to, subject, template, payload);
  }

  @OnEvent(UserEvents.SEND_ORDER_INVOICE, { async: true })
  async sendOrderInvoiceEmail(payload) {
    const template = 'order-invoice',
      subject = 'Order Successful',
      to = payload.email;

    console.log(payload);
    await this.emailService.sendEmail(to, subject, template, payload);
  }

  @OnEvent(UserEvents.SEND_RETURN_REQUEST_OUTCOME_MAIL, { async: true })
  async sendReturnRequestUpdateMail(payload) {
    const template = 'return-request-outcome',
      subject = 'Return Request Update',
      to = payload.email;

    console.log(payload);
    await this.emailService.sendEmail(to, subject, template, payload);
  }

  @OnEvent(UserEvents.SEND_PASSWORD_RESET_MAIL, { async: true })
  async sendRestPasswordEmail(payload) {
    const template = 'reset-password',
      subject = 'Password Reset',
      to = payload.email;

    payload.resetUrl = `${this.configService.get<String>('APP_URL')}/account-recovery/reset?token=${
      payload.resetToken
    }`;

    await this.emailService.sendEmail(to, subject, template, payload);
  }

  async sendEmailNotification(
    to: string,
    subject: string,
    template: string,
    data: any,
    type?: string,
  ) {
    await this.emailService.sendEmail(to, subject, template, data);
  }

  async sendPushNotification(messages: firebaseMessage[]) {
    await this.pushService.sendFirebaseMessages(messages);
  }

  /**
   * setup other notification types here
   */
}
