import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsIn,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryParamsDto {
  @IsOptional()
  @IsIn(['customer', 'merchant', 'admin'])
  role: string;

  @IsOptional()
  productId?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  brandSlug?: string;

  @IsOptional()
  actualPrice?: string;

  @IsOptional()
  discountedPrice?: string;

  @IsOptional()
  categoryId?: number;

  @IsOptional()
  orderId?: string;

  @IsOptional()
  orderIds?: string[];

  @IsOptional()
  orderStatus?: string;

  @IsOptional()
  userId?: string;

  @IsDateString()
  @IsOptional()
  startsAt?: Date;

  @IsDateString()
  @IsOptional()
  endsAt?: Date;

  @IsOptional()
  shortage?: number;

  @IsOptional()
  @Transform(({ value }) =>
    isNaN(parseInt(value, 10)) ? 25 : parseInt(value, 10),
  )
  limit = 25;

  @IsOptional()
  @Transform(({ value }) =>
    isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10),
  )
  page = 1;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  sender: string;

  @IsString()
  @IsOptional()
  courier: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  fromWalletId;

  @IsOptional()
  toWalletId;

  @IsOptional()
  minAmount?: number;

  @IsOptional()
  maxAmount?: number;

  @IsOptional()
  discount?: number;

  @IsOptional()
  color?: string;

  @IsOptional()
  search?: string;
}
