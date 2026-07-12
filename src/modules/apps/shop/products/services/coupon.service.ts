import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coupon } from '../entities/coupon.entity';
import { ProductRepository } from '../repositories/product.repository';
import { CouponRepository } from '../repositories/coupon.repository';
import { In } from 'typeorm';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createCoupon(data): Promise<Coupon> {
    const {
      coupon_code,
      maximum_use,
      used,
      valid_from,
      valid_upto,
      pricing_rule,
      coupon_type,
      discount_percentage,
      description,
    } = data;
    const existingCoupon = await this.couponRepository.findOne({
      code: coupon_code,
    });
    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists.');
    }

    let products = [];
    if (pricing_rule.items.length > 0) {
      const itemCodes = pricing_rule.items.map((p) => p.item_code);
      products = await this.productRepository.find({
        erpSKUNumber: In(itemCodes),
      });
    }

    const coupon = await this.couponRepository.create({
      code: coupon_code,
      maxUsage: maximum_use,
      usedCount: used,
      validFrom: valid_from,
      validTo: valid_upto,
      pricingRule: pricing_rule,
      discount: discount_percentage,
      type: coupon_type,
      description: description,
      products,
    });

    return coupon;
  }

  async updateCoupon(data): Promise<Coupon> {
    const {
      coupon_code,
      maximum_use,
      used,
      valid_from,
      valid_upto,
      pricing_rule,
      coupon_type,
      discount_percentage,
      description,
    } = data;
    const coupon = await this.couponRepository.findOne(
      { code: coupon_code },
      { relations: { products: true } },
    );
    if (!coupon) {
      throw new NotFoundException(`Coupon with ${coupon_code} not found.`);
    }

    let products = [];
    if (pricing_rule.items.length > 0) {
      const itemCodes = pricing_rule.items.map((p) => p.item_code);
      products = await this.productRepository.find({
        erpSKUNumber: In(itemCodes),
      });
    }

    const updatedCoupon = await this.couponRepository.findByCodeAndUpdate(
      coupon_code,
      {
        code: coupon_code,
        maxUsage: maximum_use,
        usedCount: used,
        validFrom: valid_from,
        validTo: valid_upto,
        pricingRule: pricing_rule,
        discount: discount_percentage,
        type: coupon_type,
        description: description,
        products,
      },
    );
    return updatedCoupon;
  }

  async getCouponByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ code });
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found.`);
    }
    return coupon;
  }

  async validateCoupon(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne(
      { code },
      { relations: { products: true } },
    );

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code.');
    }

    const now = new Date();

    if (coupon.validFrom && now < coupon.validFrom) {
      throw new BadRequestException('Coupon is not valid yet.');
    }

    if (coupon.validTo && now > coupon.validTo) {
      throw new BadRequestException('Coupon has expired.');
    }

    if (
      coupon.maxUsage !== null &&
      coupon.usedCount !== null &&
      coupon.usedCount >= coupon.maxUsage
    ) {
      throw new BadRequestException('Coupon usage limit reached.');
    }

    return coupon;
  }
}
