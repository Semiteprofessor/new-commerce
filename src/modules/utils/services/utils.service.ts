import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}

  async fetchAddressSuggestions(input: string): Promise<any> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: this.configService.get('GOOGLE_MAPS_API_KEY'),
          },
        },
      );

      return response.data.predictions;
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      throw error;
    }
  }
}
