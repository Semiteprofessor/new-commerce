import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsOptional()
  comment?: string;

  @ApiProperty()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsOptional()
  issues: string[];
}
