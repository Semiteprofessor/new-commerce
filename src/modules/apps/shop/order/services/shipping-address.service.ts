import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { ShippingAddress } from '../entities/shipping-address.entity';
import {
  CalculateShippingFeeDto,
  CreateShippingAddressDto,
  UpdateShippingAddressDto,
} from '../dto/shipping-address.dto';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../../modules/common/dtos/pagination.dto';
import { ErrorCodes } from '../../../../../modules/common/error-codes.enum';
import { ShippingAddressRepository } from '../repositories/shipping-address.repository';

import { BusinessProfileRepository } from '../../merchants/repositories/business-profile.repository';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import { RedisService } from '../../../../../modules/redis/redis.service';

import { UserRepository } from '../../../../../modules/core/users/repositories/user.repository';
import { Location } from '../dto/shipping-address.dto';
import { CartRepository } from '../../cart/repositories/cart.repository';
import { ItranxitService } from '../../../../../modules/itranxit/services/itranxit.service';
import { CartService } from '../../cart/services/cart.service';
@Injectable()
export class ShippingAddressService {
  constructor(
    private readonly shippingAddressRepository: ShippingAddressRepository,
    private readonly userRepository: UserRepository,
    private readonly businessProfileRepository: BusinessProfileRepository,
    private readonly cartRepository: CartRepository,
    private readonly redisService: RedisService,
    private readonly itranxitService: ItranxitService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}

  async getAllShippingAddresses(userId: string): Promise<ShippingAddress[]> {
    return this.shippingAddressRepository.find({ user: { id: userId } });
  }

  async calculateShippingFee(user: ActorUser, dto: CalculateShippingFeeDto) {
    const cart = await this.cartService.getCart(user);
    if (cart.items.length <= 0) return { shippingFee: 0 };

    const userLocation = {
      name: `user_${user.id}`,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };

    const riderLocation = {
      name: 'rider_location',
      latitude: 6.546359352342857,
      longitude: 3.359886611367501,
    };

    const merchantLocations = new Map<
      string,
      { name: string; latitude: number; longitude: number }
    >();

    for (const item of cart.items) {
      const merchantId = item.product.merchantId;
      if (!merchantLocations.has(merchantId)) {
        const business = await this.businessProfileRepository.findOne({
          owner: { id: merchantId },
        });
        if (!business) {
          throw new NotFoundException(
            `Business not found for merchantId: ${merchantId}`,
          );
        }
        merchantLocations.set(merchantId, {
          name: `merchant_${merchantId}`,
          latitude: business.businessLocationLat,
          longitude: business.businessLocationLong,
        });
      }
    }

    let cumulativeShippingFee = 0;
    let previousLocation = riderLocation;

    for (const merchantLocation of merchantLocations.values()) {
      let distance = await this.redisService.calculateDistance(
        'shipping',
        previousLocation,
        merchantLocation,
      );
      console.log(distance);
      distance = Math.min(distance, 100);
      const response = await this.itranxitService.getShippingCost(distance);
      if (response.status === 200) {
        cumulativeShippingFee += response.data?.data?.basePrice ?? 0;
      }
      previousLocation = merchantLocation;
    }

    let finalDistance = await this.redisService.calculateDistance(
      'shipping',
      previousLocation,
      userLocation,
    );

    finalDistance = Math.min(finalDistance, 100);
    const finalResponse =
      await this.itranxitService.getShippingCost(finalDistance);
    if (finalResponse.status === 200) {
      cumulativeShippingFee += finalResponse.data?.data?.basePrice ?? 0;
    }

    let totalPrice = Number(cart.totalPrice) || 0;
    const previousShippingPrice = Number(cart.shippingPrice) || 0;
    totalPrice = totalPrice - previousShippingPrice + cumulativeShippingFee;

    await this.cartRepository.findOneAndUpdate(
      { id: cart.id },
      { shippingPrice: cumulativeShippingFee, totalPrice },
    );

    return { shippingFee: cumulativeShippingFee };
  }

  async calculateShippingFeeWithoutCart(
    user,
    dto: CalculateShippingFeeDto,
    merchantId: string,
    quantity: number,
  ) {
    const userLocation = {
      name: `user_${user.id}`,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };

    const business = await this.businessProfileRepository.findOne({
      owner: { id: merchantId },
    });
    if (!business) {
      throw new NotFoundException(
        `Business not found for merchantId: ${merchantId}`,
      );
    }

    const merchantLocation = {
      name: `merchant_${merchantId}`,
      latitude: business.businessLocationLat,
      longitude: business.businessLocationLong,
    };

    const riderLocation = {
      name: 'rider_location',
      latitude: 6.546359352342857,
      longitude: 3.359886611367501,
    };

    const route: Location[] = [riderLocation, merchantLocation, userLocation];
    let totalShippingFee = 0;

    for (let i = 0; i < route.length - 1; i++) {
      const start = route[i];
      const end = route[i + 1];

      const key = `${start.name}-${end.name}`;

      let distance = await this.redisService.calculateDistance(key, start, end);
      distance = Math.min(distance, 100);

      const response = await this.itranxitService.getShippingCost(distance);
      if (response.status === 200) {
        totalShippingFee += response.data?.data?.basePrice || 0;
      }
    }

    return { shippingFee: totalShippingFee };
  }

  async getShippingAddress(
    userId: string,
    id: string,
  ): Promise<ShippingAddress> {
    const address = await this.shippingAddressRepository.findOne({
      id,
      user: { id: userId },
    });
    if (!address) {
      throw new NotFoundException(
        `Shipping address with ID ${id} not found or does not belong to user ${userId}.`,
      );
    }
    return address;
  }

  async createShippingAddress(
    userId: string,
    createDto: CreateShippingAddressDto,
  ): Promise<ShippingAddress> {
    const user = await this.userRepository.findOne({ id: userId });
    const existingAddress = await this.shippingAddressRepository.findOne({
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      user: { id: userId },
    });
    if (existingAddress)
      throw new BadRequestException(
        `shipping address with latitude: ${createDto.latitude} and longitude:${createDto.longitude} already exists for this user`,
      );
    const newAddress = await this.shippingAddressRepository.create({
      ...createDto,
      user,
    });
    if (newAddress && newAddress.isDefault) {
      await this.shippingAddressRepository.findOneAndUpdate(
        { user: { id: userId }, id: Not(newAddress.id) },
        { isDefault: false },
      );
    }
    return newAddress;
  }

  async updateShippingAddress(
    userId: string,
    id: string,
    updateDto: UpdateShippingAddressDto,
  ): Promise<ShippingAddress> {
    const address = await this.getShippingAddress(userId, id);
    return this.shippingAddressRepository.findOneAndUpdate(
      { id: address.id },
      updateDto,
    );
  }

  async deleteShippingAddress(userId: string, id: string): Promise<void> {
    const address = await this.getShippingAddress(userId, id);
    await this.shippingAddressRepository.findOneAndUpdate(
      { id },
      { deletedAt: new Date() },
    );
  }
}
