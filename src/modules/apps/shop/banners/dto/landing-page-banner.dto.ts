import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateLandingPageBannerDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  images: string[];
}
