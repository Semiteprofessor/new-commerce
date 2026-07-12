import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsBoolean,
  IsInt,
  IsLatitude,
  IsNumber,
  IsLongitude,
} from 'class-validator';

export class CreateShippingAddressDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'Primary phone number' })
  @IsString()
  @IsNotEmpty()
  phone1: string;

  @ApiProperty({
    example: '+0987654321',
    description: 'Secondary phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone2?: string;

  @ApiProperty({
    example: '123 Main Street, City',
    description: 'Full address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  lga: string;

  @ApiProperty({
    example: '12345',
    description: 'Postal code',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  // @ApiProperty({ example: 'Lagos', description: 'State', required: false })
  //   @IsString()
  //   @IsOptional()
  //   state?: string;

  @ApiProperty({
    example: true,
    description: 'Set as default shipping address',
  })
  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;
}

export class UpdateShippingAddressDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '08034567890', required: false })
  @IsString()
  @IsOptional()
  phone1?: string;

  @ApiProperty({ example: '09087654321', required: false })
  @IsString()
  @IsOptional()
  phone2?: string;

  @ApiProperty({ example: '123 Main Street, City', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  lga?: string;

  @ApiProperty({ example: '12345', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

export class CalculateShippingFeeDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  address: string;
}