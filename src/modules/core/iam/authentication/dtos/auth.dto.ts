import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength, ValidateIf } from 'class-validator';

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
}