import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async getBrands(): Promise<any> {
    return this.brandRepository.find();
  }
}
