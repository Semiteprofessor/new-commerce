import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductService } from 'src/modules/apps/shop/products/services/product.service';
import axios from 'axios';
import { User } from 'src/modules/core/users/entities/user.entity';
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
}
