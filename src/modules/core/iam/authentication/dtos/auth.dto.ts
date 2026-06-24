import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength, ValidateIf } from 'class-validator';

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
}