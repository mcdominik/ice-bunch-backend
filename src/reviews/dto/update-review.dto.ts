import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateReviewDto {
    @IsString()
    userId: string;

    @IsString()
    iceCreamId: string;

    @IsNumber()
    rating: number;

    @IsDateString()
    lastUpdate: string;

    @IsString()
    @IsOptional()
    content: string;
}