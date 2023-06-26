import { IsNumber, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

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
    @MaxLength(900)
    @IsOptional()
    content: string;
}