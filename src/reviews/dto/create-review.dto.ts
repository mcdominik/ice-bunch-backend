import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    userId: string;

    @IsString()
    username: string;

    @IsString()
    iceCreamId: string;

    @IsNumber()
    rating: number;

    @IsDate()
    lastUpdate: Date;

    @IsString()
    @IsOptional()
    content: string;
}