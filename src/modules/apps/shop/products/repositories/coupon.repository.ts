import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class CouponRepository extends EntityRepository<Coupon> {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {
    super(couponRepository);
  }

  async findByCodeAndUpdate(code, couponData) {
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: code },
      relations: { products: true },
    });

    if (!existingCoupon) {
      throw new NotFoundException('Coupon not found');
    }

    existingCoupon.maxUsage = couponData.maximum_use;
    existingCoupon.usedCount = couponData.used;
    existingCoupon.validFrom = couponData.valid_from;
    existingCoupon.validTo = couponData.valid_upto;
    existingCoupon.pricingRule = couponData.pricing_rule;
    existingCoupon.discount = couponData.discount_percentage;
    existingCoupon.type = couponData.coupon_type;
    existingCoupon.description = couponData.description;
    existingCoupon.products = couponData.products;
    return await this.couponRepository.save(existingCoupon);
  }
}
