import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MediaDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Product image' })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({ example: 'image' })
  @IsOptional()
  @IsString()
  type?: string;
}

class AddressDto {
  @ApiProperty({ example: 37.7749 })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ example: -122.4194 })
  @IsNumber()
  @IsNotEmpty()
  long: number;

  @ApiProperty({ example: '123 Main St,Lagos' })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class SubmitReturnRequestDto {
  @ApiProperty({ example: 'f3e1a7d9-7d3b-4b9a-bf43-3c5d5825f6f1' })
  @IsNotEmpty()
  @IsString()
  orderItemId: string;

  @ApiProperty({ example: 'Received wrong item' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ type: [MediaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];

  @ApiProperty({ type: AddressDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receipt: string;

  @ApiProperty({ example: 'The item was not what I ordered' })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
