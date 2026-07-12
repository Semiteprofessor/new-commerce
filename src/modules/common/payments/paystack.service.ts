import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

/**
 * Todo
 * Refactor this when we have
 * multiple payment processors
 */
@Injectable()
export class PaystackService {
  protected baseUrl: string;

  protected secretKey: string;

  protected preferredBank: string;

  protected callBackUrl: string;

  private apiClient: any;
  private paystackCache: Map<string, any>;

  // public static readonly providerName: PaymentProviders = PaymentProviders.PAYSTACK;

  constructor(
    private configService: ConfigService,
    // private readonly httpLogger: HttpLogger,
  ) {
    this.baseUrl = configService.get('PAYSTACK_BASE_URL');
    this.secretKey = configService.get('PAYSTACK_SECRET_KEY');

    this.apiClient = axios.create();
    this.setupInterceptors();
    this.paystackCache = new Map();
  }

  private setupInterceptors() {
    this.apiClient.interceptors.request.use(
      (config) => {
        config.baseURL = this.configService.get('PAYSTACK_BASE_URL');
        config.headers.Authorization = `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`;
        config.headers['Content-Type'] = 'application/json';

        // this.httpLogger.logRequest(`Paystack 💸`, {
        //   method: config.method,
        //   url: `${config.baseURL}${config.url}`,
        //   data: config.data,
        // });
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.apiClient.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        const { data, status } = error.response;
        return Promise.reject({
          service: 'PAYSTACK',
          isThirdPartyError: true,
          thirdPartyErrorCode: status,
          status,
          message: `${data?.message} ${data?.meta.nextStep}`,
        });
      },
    );
  }

  async verifyTxn(ref: string): Promise<any> {
    try {
      const {
        data: { status: verificationStatus },
        message,
      } = await this.apiClient.get(`/transaction/verify/${ref}`);

      if (verificationStatus == 'success') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  // async performBankTransfer(
  //   transfer: PaymentTransfer,
  //   secretKey?: string,
  // ): Promise<PaymentTransferResponse> {
  //   let recipientId = transfer.providerId;
  //   if (!recipientId) {
  //     // Perform these steps for an transfer recipient that isn't already registered with Paystack
  //     // See: https://paystack.com/docs/transfers/single-transfers
  //
  //     // Verify Account
  //     // const { data: accountVerfication } = await this.resolveAccountNumber({
  //     //   account_number: transfer.accountNumber,
  //     //   bank_code: transfer.bank,
  //     // });
  //     // console.log(accountVerfication);
  //     // Create transfer recipient
  //     const { data: transferRecipient } = await this.createTransferRecipient(
  //       {
  //         type: 'nuban',
  //         name: transfer.name,
  //         account_number: transfer.accountNumber,
  //         bank_code: transfer.bank,
  //         currency: transfer.currency,
  //       },
  //       secretKey,
  //     );
  //     recipientId = transferRecipient.recipient_code;
  //   }
  //
  //   // Initiate Transfer
  //   const { data: transferResponse } = await this.initiateBankTransfer(
  //     {
  //       source: 'balance',
  //       reason: transfer.narration,
  //       amount: transfer.amount,
  //       recipient: recipientId,
  //     },
  //     secretKey,
  //   );
  //   return {
  //     id: transferResponse.id.toString(),
  //     amount: transfer.amount,
  //     narration: transfer.narration,
  //     reference: transfer.reference,
  //     status: transferResponse.status,
  //     recipientId,
  //     currency: transferResponse.currency,
  //     transferCode: transferResponse.transfer_code,
  //   };
  // }

  // async chargeCard(
  //   body: PaystackChargeAuthorization,
  //   secretKey?: string,
  // ): Promise<PaystackChargeAuthorizationResponse> {
  //   return await this.apiClient.post('/transaction/charge_authorization', {
  //     ...body,
  //   });
  // }

  // async createTransferRecipient(
  //   body: PaystackCreateTransferRecipient,
  //   secretKey?: string,
  // ): Promise<PaystackCreateTransferRecipientResponse> {
  //   try {
  //     const url = `${this.baseUrl}/transferrecipient`;
  //     const response = await this.httpService
  //       .post(url, body, this.getOptions(secretKey))
  //       .toPromise();
  //
  //     return response.data;
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     console.log(error.data);
  //     throw new HttpException(message, status);
  //   }
  // }

  // async initiateBankTransfer(
  //   body: PaystackInitiateTransfer,
  //   secretKey?: string,
  // ): Promise<PaystackInitiateTransferResponse> {
  //   try {
  //     const url = `${this.baseUrl}/transfer`;
  //     const response = await this.httpService
  //       .post(url, body, this.getOptions(secretKey))
  //       .toPromise();
  //
  //     return response.data;
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     console.log(error.data);
  //     throw new HttpException(message, status);
  //   }
  // }

  // async finalizeBankTransfer(
  //   transferCode: string,
  //   otp: string,
  //   secretKey?: string,
  // ): Promise<PaymentTransferResponse> {
  //   try {
  //     const url = `${this.baseUrl}/transfer/finalize_transfer`;
  //     const response = await this.httpService
  //       .post(url, { transfer_code: transferCode, otp }, this.getOptions(secretKey))
  //       .toPromise();
  //
  //     return response.data;
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     console.log(error.data);
  //     throw new HttpException(message, status);
  //   }
  // }

  // async refundPayment(reference: string, secretKey?: string): Promise<RefundPaymentResponse> {
  //   try {
  //     const url = `${this.baseUrl}/refund`;
  //     const response = await this.httpService
  //       .post(url, { transaction: reference }, this.getOptions(secretKey))
  //       .toPromise();
  //     const { data } = response;
  //     const { transaction } = data?.data || {};
  //     return {
  //       amount: transaction?.amount,
  //       status: data.status,
  //       id: transaction?.id,
  //       reference: transaction?.reference,
  //     };
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     throw new HttpException(message, status);
  //   }
  // }

  // getTransactionMetadata(transaction: Partial<PaymentVerificationResponse>): any {
  //   const { data = {} } = transaction;
  //   const { metadata = {} } = data;
  //   // android paystack lib hack
  //   if (Object.keys(metadata).includes('metadata')) {
  //     return metadata.metadata;
  //   }
  //   return metadata;
  // }

  // async generateDedicatedVirtualAccount(
  //   body: PaystackCreateDedicatedVirtualAccount,
  //   secretKey?: string,
  // ): Promise<PaystackCreateDedicatedVirtualAccountResponse> {
  //   try {
  //     // email, first_name, middle_name, last_name, phone, preferred_bank, country
  //     const url = `${this.baseUrl}/dedicated_account/assign`;
  //     const response = await this.httpService
  //       .post(url, { ...body, preferred_bank: this.preferredBank }, this.getOptions(secretKey))
  //       .toPromise();
  //     const { data } = response;
  //     return {
  //       ...data,
  //     };
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     throw new HttpException(message, status);
  //   }
  // }

  // async initiateDirectDebitAuthorization(
  //   email: string,
  //   secretKey?: string,
  // ): Promise<PaystackInitiateDirectDebitResponse> {
  //   try {
  //     const url = `${this.baseUrl}/customer/authorization/initialize`;
  //     const requestPayload = {
  //       email: email?.trim(),
  //       channel: 'direct_debit',
  //       callback_url: this.callBackUrl,
  //     };
  //
  //     const response = await this.httpService
  //       .post(url, requestPayload, this.getOptions(secretKey))
  //       .toPromise();
  //     return response?.data;
  //   } catch (error) {
  //     const message = error.response.data.message || 'An Error Occurred';
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     throw new HttpException(message, status);
  //   }
  // }
}
