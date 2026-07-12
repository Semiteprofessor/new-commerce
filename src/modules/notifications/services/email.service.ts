import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private ses;
  constructor(private readonly mailerService: MailerService) {
    this.ses = new AWS.SES({ region: 'eu-north-1' });
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: any,
  ) {
    try {
      const result = await this.mailerService.sendMail({
        to,
        subject,
        template: `./${templateName}`,
        context: templateData,
      });

      console.log('Email sent successfully');
      console.log(result);
    } catch (e) {
      console.error('EMAIL ERROR');
      console.error(e);
    }
  }

  async _sendTemplatedEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: any,
  ) {
    const params = {
      Source: 'semiteprofessor@gmail.com',
      Template: templateName,
      Destination: { ToAddresses: [to] },
      TemplateData: JSON.stringify(templateData),
    };

    return this.ses.sendTemplatedEmail(params).promise();
  }
}
