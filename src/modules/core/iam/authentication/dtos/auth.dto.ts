import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";

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