import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    userId: string;

    @IsString()
    iceCreamId: string;

    @IsNumber()
    rating: number;

    @IsString()
    @IsOptional()
    content: string;
}