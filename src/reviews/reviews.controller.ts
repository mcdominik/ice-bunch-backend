import { Controller, Get, Body, Param, Delete, Put, UseGuards, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewOwnerGuard } from './guards/review-owner.guard';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, ReviewOwnerGuard)
  @Put(':reviewId')
  updateReview(@Param('reviewId') reviewId: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.updateReview(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReview(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(dto)
  }

  @UseGuards(JwtAuthGuard, ReviewOwnerGuard)
  @Delete(':reviewId')
  removeReviewAndUpdateRanking(@Param('reviewId') reviewId: string) {
    return this.reviewsService.removeReviewAndUpdateRanking(reviewId)
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get('user/:userId')
  getUserAllReviewsByUserId(@Param('userId') userId: string) {
    return this.reviewsService.getUserAllReviewsByUserId(userId)
  }

  @Get('ice-cream/:iceCreamId')
  getIceCreamAllReviews(@Param('iceCreamId') iceCreamId: string) {
    return this.reviewsService.getIceCreamAllReviews(iceCreamId)
  }
}
