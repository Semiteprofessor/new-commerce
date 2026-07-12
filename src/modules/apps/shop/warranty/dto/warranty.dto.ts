import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClaimDetailsDto {
  @IsString()
  @IsNotEmpty()
  imei?: string;

  @IsString()
  @IsNotEmpty()
  brand_model: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  pickupDate: string;

  @IsString()
  @IsNotEmpty()
  pickupTime: string;

  @IsString()
  @IsNotEmpty()
  deviceIssue: string;
}

export class WarrantyDto {
  @IsOptional()
  @IsString()
  imei?: string;

  @IsString()
  @IsNotEmpty()
  brand_model: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  claimant?: string;

  @IsString()
  @IsOptional()
  warrantyStatus?: string;

  @IsBoolean()
  @IsOptional()
  isWarrantyClaimed?: boolean;

  @IsDateString()
  @IsOptional()
  warrantyExpiryDate?: Date;

  @IsString()
  @IsOptional()
  pickupDate?: string;

  @IsString()
  @IsOptional()
  pickupTime?: string;

  @IsString()
  @IsNotEmpty()
  deviceIssue: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClaimDetailsDto)
  claimDetails?: ClaimDetailsDto;
}
