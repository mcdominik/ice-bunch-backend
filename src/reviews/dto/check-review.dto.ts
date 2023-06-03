import { IsString } from 'class-validator';

export class CheckReviewDto {
    @IsString()
    userId: string;

    @IsString()
    iceCreamId: string;
}