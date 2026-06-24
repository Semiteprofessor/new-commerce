import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductService } from 'src/modules/apps/shop/products/services/product.service';
import axios from 'axios';
import { User } from 'src/modules/core/users/entities/user.entity';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
@Injectable()
export class ErpNextService {
  private readonly apiClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {
    this.apiClient = axios.create({
      baseURL: this.configService.get('ERPNEXT_BASE_URL'),
      headers: {
        'Content-Type': 'application/json',
        Token: `${this.configService.get('ERPNEXT_API_SECRET')}`,
      },
    });
    // this.setupInterceptors();}
  }

  async createUser(data: User) {
    try {
      console.log(data);
      const res = await this.apiClient.post(
        'ecommerce.controllers.user_controller.add_user',
        {
          x: data.id,
          user_id: data.id,
          username: data.username,
          email: data.email,
          password_hash: data.password, // not needed
          password_salt: data.password,
        },
      );

      console.log(res.data.message.body);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createMerchant(data: User, business: BusinessProfile) {
    try {
      const res = await this.apiClient.post(
        'ecommerce.controllers.merchant_controller.add_merchant',
        {
          merchant_id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role,
          business_name: business.name,
          business_type: business.businessType,
          business_category: business.businessCategory,
          business_address: data.address,
          business_location_lat: business.businessLocationLat,
          business_location_long: business.businessLocationLong,
          street: 'Spencer',
          city: 'Ikeja',
          state: 'Lagos',
          country: 'Nigeria',
        },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
