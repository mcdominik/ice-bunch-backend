import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
    @IsNumber()
    rating: number;

    @IsString()
    @IsOptional()
    content: string;
}