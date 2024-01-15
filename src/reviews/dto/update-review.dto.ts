import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @IsOptional()
  rating: number;

  @IsString()
  @MaxLength(900)
  @IsOptional()
  content: string;
}
