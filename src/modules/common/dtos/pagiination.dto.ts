import { IsOptional, IsIn } from 'class-validator';

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
}
