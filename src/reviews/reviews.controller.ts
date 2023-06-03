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
  removeReview(@Body() dto: RemoveReviewDto) {
    return this.reviewsService.removeReview(dto)
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get('user/:userId')
  getUserAllReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserAllReviews(userId)
  }

  // @Get('user/:userId/:iceCreamId')
  // checkIfUserAlreadyReviewed(@Param('userId') userId: string, @Param('iceCreamId') iceCreamId: string) {
  //   return this.reviewsService.checkIfUserAlreadyReviewed(userId, iceCreamId)
  // }

  @Post('user/is')
  checkIfUserAlreadyReviewed(@Body() dto: CheckReviewDto) {
    return this.reviewsService.checkIfUserAlreadyReviewed(dto)
  }

  @Get('ice-cream/:iceCreamId')
  getIceCreamAllReviews(@Param('iceCreamId') iceCreamId: string) {
    return this.reviewsService.getIceCreamAllReviews(iceCreamId)
  }
}
