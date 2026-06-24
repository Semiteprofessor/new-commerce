import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MinLength, ValidateIf } from 'class-validator';
import { UserRole } from 'src/modules/common/enums/role.enum';

export class CommonFields {
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^\d{11}$/, { message: 'Phone number must be 11 digits' })
  phone: string;
}

export class SignIn {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  role: string;
}


export class SignupDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  firstName: string;

  @ValidateIf((o) => o.type === 'COURIER')
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEnum(['customer', 'merchant'])
  role: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  gender?: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessName: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  business_type: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsArray()
  @IsOptional()
  @ApiProperty()
  business_category: string[];

  @ValidateIf((o) => o.role === 'merchant')
  @IsOptional()
  @IsArray()
  @ApiProperty()
  business_section: string[];

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessAddress: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessLocationLat: number;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessLocationLong: number;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountName: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountNumber: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bankCode: string;

  @ValidateIf((o) => o.role === 'merchant')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bankName: string;

  @ValidateIf((o) => o.role === 'merchant')
  @ApiProperty()
  @IsString()
  @IsOptional()
  businessDocument?: string;
}

export class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  firstName: string;

  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(['customer', 'merchant'])
  role: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  gender?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  fcmToken: string;

  @IsString()
  @ApiProperty()
  companyName: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  profilePhoto?: string;

  @ApiProperty()
  phone: string;

  @IsOptional()
  @ApiProperty()
  zip?: string;

  @IsOptional()
  @ApiProperty()
  phone2: string;

  @IsOptional()
  @ApiProperty()
  state: string;

  @IsOptional()
  @ApiProperty()
  address: string;

  @IsEnum(UserRole, { message: 'user type must be either business or driver' })
  @ApiProperty({
    enum: UserRole,
    description: 'Specify if the profile is for a business or driver',
  })
  userType: UserRole;
}

export class VerifyOtpDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  otp: string;
}

export class ResendOTPDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class ResetPassword {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsBoolean()
  @IsOptional()
  mobile?: boolean;
}

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp: string;
}
