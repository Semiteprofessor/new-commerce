import {
  IsBoolean,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CourierOnlineStatusDto {
  @IsBoolean()
  isOnline: boolean;
}

export class CourierDeliveryToolDto {
  @IsString()
  vehicleType: string;

  @IsUrl()
  proof: string;

  @IsUrl()
  @IsOptional()
  image: string;
}

export class CourierBankInfoDto {
  @IsString()
  bankName: string;

  @IsString()
  bankCode: string;

  @IsString()
  bvn: string;

  @IsString()
  holder: string;

  @IsString()
  accountNumber: string;
}

export class CourierGuarantorDto {
  @IsString()
  @IsNotEmpty({ message: 'First name must not be empty' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name must not be empty' })
  readonly lastName: string;

  @IsString({ message: 'relationship is required' })
  readonly relationship: string;

  @IsString({ message: 'occupation is required' })
  readonly occupation: string;

  @IsString({ message: 'address is required' })
  readonly address: string;

  @IsString({ message: 'Phone number is required' })
  readonly phone: string;

  @IsEmail({}, { message: 'Invalid email address' })
  readonly email?: string;
}

export class CourierLocationDto {
  @IsLatitude()
  readonly lat: number;

  @IsLongitude()
  readonly lng: number;
}
