import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RemoveReviewDto {
    @IsString()
    userId: string;

    @IsString()
    iceCreamId: string;
}