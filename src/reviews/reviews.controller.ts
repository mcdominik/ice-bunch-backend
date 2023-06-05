import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Put()
  createOrUpdateReview(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createOrUpdateReview(dto)
  }

  @Delete(':reviewId')
  removeReviewAndUpdateRanking(@Param('reviewId') reviewId: string) {
    return this.reviewsService.removeReviewAndUpdateRanking(reviewId)
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
