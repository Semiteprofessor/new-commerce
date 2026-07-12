import { Injectable } from "@nestjs/common";
import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { BatchResponse, TokenMessage } from 'firebase-admin/messaging';
import { firebaseMessage } from "../notification.types";
import { chunk } from 'lodash';
import { mapLimit } from 'async';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, cert } from 'firebase-admin/app';

@Injectable()
export class PushService {
  constructor(private readonly configService: ConfigService) {
    const adminConfig: ServiceAccount = {
      projectId: this.configService.get('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
    };

    initializeApp({
      credential: cert(adminConfig),
    });
  }

  async sendMessage(
    messages: TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    
return await getMessaging().sendEach(messages, dryRun);
  }

  public async sendFirebaseMessages(
    firebaseMessages: firebaseMessage[],
  ): Promise<BatchResponse> {
    const batchFirebaseMessages = chunk(firebaseMessages, 100);

    const batchedResponses = await mapLimit<firebaseMessage[], BatchResponse>(
      batchFirebaseMessages,
      5,
      async (groupedMessages: firebaseMessage[]): Promise<BatchResponse> => {
        try {
          const tokenMessages: TokenMessage[] = groupedMessages.map(
            ({ message, title, token }) => ({
              notification: { body: message, title },
              token,
              apns: { payload: { aps: { 'content-available': 1 } } },
            }),
          );
          return await this.sendMessage(tokenMessages, false);
        } catch (error) {
          const firebaseError = error as firebase.FirebaseError;

          return {
            responses: groupedMessages.map(() => ({
              success: false,
              error: firebaseError,
            })),
            successCount: 0,
            failureCount: groupedMessages.length,
          };
        }
      },
    );

    return batchedResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown as BatchResponse,
    );
  }
}