import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';

export enum PaymentType {
  WALLET_FUNDING = 'WALLET_FUNDING',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
}

export class InitiateFundingDto {
  @ValidateIf((o) => o.type === PaymentType.WALLET_FUNDING)
  @IsNumber()
  readonly amount: number;

  @IsEnum(PaymentType)
  readonly type: PaymentType;

  @ValidateIf((o) => o.type === PaymentType.ORDER_PAYMENT)
  @IsString()
  readonly orderId?: string;
}
