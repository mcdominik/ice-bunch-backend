import { IsNumber, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

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
    @MaxLength(900)
    @IsOptional()
    content: string;
}