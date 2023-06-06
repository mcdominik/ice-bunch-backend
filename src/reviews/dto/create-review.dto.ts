import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    userId: string;

    @IsString()
    username: string;

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