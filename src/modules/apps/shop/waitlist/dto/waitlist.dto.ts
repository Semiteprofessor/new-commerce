import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class WaitlistDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
