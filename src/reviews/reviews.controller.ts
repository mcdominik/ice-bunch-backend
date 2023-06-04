import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RemoveReviewDto } from './dto/remove-review.dto';
import { CheckReviewDto } from './dto/check-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Put()
  createOrUpdateReview(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createOrUpdateReview(dto)
  }

  @Delete()
  removeReviewAndUpdateRanking(@Body() dto: RemoveReviewDto) {
    return this.reviewsService.removeReviewAndUpdateRanking(dto)
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get('user/:userId')
  getUserAllReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserAllReviews(userId)
  }

  @Get('ice-cream/:iceCreamId')
  getIceCreamAllReviews(@Param('iceCreamId') iceCreamId: string) {
    return this.reviewsService.getIceCreamAllReviews(iceCreamId)
  }
}
