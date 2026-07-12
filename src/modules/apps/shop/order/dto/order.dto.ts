import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  product_name: string;

  @IsInt()
  qty: number;

  @IsString()
  image: string;

  @IsDecimal()
  price: number;

  @IsString()
  seller_name: string;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shipping_address: string;

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsObject()
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };

  @IsDecimal()
  shipping_fee: number;

  @IsDecimal()
  discount: number;

  @IsDecimal()
  subtotal: number;

  @IsDecimal()
  grand_total: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  paidAt?: Date;

  @IsOptional()
  @IsBoolean()
  isDelivered?: boolean;

  @IsOptional()
  deliveredAt?: Date;
}

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  shippingAddressId: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;
}

export class UpdateImeiDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imeiNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  shipmentCode?:string;
}

export class confirmDeliveryDto {
  

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  deliveryCode?:string;
}

