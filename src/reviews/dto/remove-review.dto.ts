import { IsString } from 'class-validator';

export class RemoveReviewDto {
    @IsString()
    reviewId: string;
}