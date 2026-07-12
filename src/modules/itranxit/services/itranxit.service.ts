import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class ItranxitService {
  private readonly apiClient;

  constructor(private readonly configService: ConfigService) {
    this.apiClient = axios.create({
      baseURL: this.configService.get('ITRANXIT_BASE_URL'),
      headers: {
        'x-api-key': `${this.configService.get('ITRANXIT_API_KEY')}`,
      },
    });
  }

  async getShippingCost(distance: number) {
    try {
      return await this.apiClient.get(
        `/api/v1/external/order/estimate/${distance}`,
      );
    } catch (error) {
      const err = error as AxiosError<any>;

      console.log(err.response?.data?.message);

      throw new BadRequestException(
        err.response?.data?.message ?? 'Something went wrong',
      );
    }
  }
}
