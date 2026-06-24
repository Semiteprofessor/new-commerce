import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Sample Product' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'id-of-category' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(500, { message: 'The actualPrice cannot be less than 500.' })
  actualPrice: number;

  @ApiProperty({ example: 80.0 })
  @IsNotEmpty()
  discountedPrice: number;

  @ApiProperty({ example: 0.2 })
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: [{ url: 'image_url', alt: 'alt text' }] })
  @IsOptional()
  @IsArray()
  images?: { url: string; alt?: string; type?: string }[];

  @ApiProperty({ example: 'Brand Name' })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Product description here' })
  @IsString()
  description: string;

  @ApiProperty({ example: [{ key: 'Size', value: 'Large' }] })
  @IsOptional()
  @IsArray()
  specification?: object[];

  @ApiProperty({ example: 'Model X' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: '1.5kg' })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ example: [{ color: 'Red' }] })
  @IsOptional()
  @IsArray()
  color?: object[];

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiProperty({ example: '1 year' })
  @IsOptional()
  @IsString()
  warranty?: string;
}

export class UpdateProductDto {}
