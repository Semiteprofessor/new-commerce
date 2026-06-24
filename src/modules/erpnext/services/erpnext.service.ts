import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ErpNextService {
  private readonly apiClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {}
}
