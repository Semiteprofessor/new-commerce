import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(0)
  discountedPrice: number;
}

export class RemoveFromCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class ApplyCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  couponCode: string;
}

export class CheckoutDto {
  @ApiProperty({ example: '08cbaa9b-651c-4e27-964b-4945e55ec133' })
  @IsString()
  @IsNotEmpty()
  shippingAddressId: string;

  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}

export class BuyNowDto {
  @ApiProperty({ example: '08cbaa9b-651c-4e27-964b-4945e55ec133' })
  @IsString()
  @IsNotEmpty()
  shippingAddressId: string;

  @ApiProperty({ example: '08cbaa9b-651c-4e27-964b-4945e55ec133' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
