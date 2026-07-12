import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WarrantyRepository } from '../repositories/warranty.repository';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from 'src/modules/common/dtos/pagination.dto';
import { Warranty } from '../entities/warranty.entity';
import { ClaimDetailsDto } from '../dto/warranty.dto';
import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WarrantyStatus } from 'src/modules/common/enums/warranty.enum';

@Injectable()
export class WarrantyService {
  constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getActiveWarranty(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    const { page = 1, limit = 10 } = query;

    const warrantyQuery = this.warrantyRepository
      .createQueryBuilder('warranty')
      .where('warranty.userId = :userId', { userId })
      .andWhere('warranty.warrantyStatus != :expired', { expired: 'EXPIRED' })
      .andWhere('warranty.deletedAt IS NULL');

    const total = await warrantyQuery.clone().getCount();

    const warranties = await warrantyQuery
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: warranties,
      pageInfo: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getClaimedWarranty(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    const { page = 1, limit = 10 } = query;

    const warrantyQuery = this.warrantyRepository
      .createQueryBuilder('warranty')
      .where('warranty.isWarrantyClaimed = :isClaimed', { isClaimed: true });

    const total = await warrantyQuery.clone().getCount();

    const warranties = await warrantyQuery
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: warranties,
      pageInfo: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExpiredWarranty(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Warranty>> {
    const { page = 1, limit = 10 } = query;

    const warrantyQuery = this.warrantyRepository
      .createQueryBuilder('warranty')
      .where('warranty.warrantyStatus = :status', {
        status: WarrantyStatus.EXPIRED,
      });

    const total = await warrantyQuery.clone().getCount();

    const warranties = await warrantyQuery
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: warranties,
      pageInfo: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async claimWarranty(
    userId: string,
    claimDto: ClaimDetailsDto,
  ): Promise<Warranty> {
    const {
      imei,
      brand_model,
      address,
      area,
      pickupDate,
      pickupTime,
      deviceIssue,
    } = claimDto;

    const warranty = await this.warrantyRepository.findOne({
      imei,
      claimant: userId,
    });

    if (!warranty) {
      console.error('No warranty found for the provided IMEI:', imei);
      throw new NotFoundException('No warranty found for the provided IMEI.');
    }

    if (warranty.isWarrantyClaimed) {
      console.error('Warranty already claimed for IMEI:', imei);
      throw new BadRequestException('Warranty has already been claimed.');
    }

    warranty.isWarrantyClaimed = true;
    warranty.warrantyStatus = WarrantyStatus.CLAIMED;
    warranty.claimDetails = {
      brand_model,
      address,
      area,
      pickupDate,
      pickupTime,
      deviceIssue,
    };

    await this.warrantyRepository.save(warranty);
    return warranty;
  }
}
