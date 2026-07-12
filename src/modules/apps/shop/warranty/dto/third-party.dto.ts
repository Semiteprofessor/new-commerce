import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ThirdPartyDto {
  @IsString()
  @IsNotEmpty()
  imei: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
