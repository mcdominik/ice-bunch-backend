import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RemoveReviewDto } from './dto/remove-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Put()
  createOrUpdateReview(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createOrUpdateReview(dto)
  }

  @Delete()
  removeReview(@Body() dto: RemoveReviewDto) {
    return this.reviewsService.removeReview(dto)
  }

  @Get(':reviewId')
  findOne(@Param('id') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get(':userId')
  getUserAllReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserAllReviews(userId)
  }
}
