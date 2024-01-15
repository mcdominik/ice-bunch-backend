import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
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
  updateReviewAndUpdateRating(
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReviewAndUpdateRating(dto, reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReviewAndUpdateRating(@Body() dto: CreateReviewDto) {
    console.log('fired');
    return this.reviewsService.createReviewAndUpdateRating(dto);
  }

  @UseGuards(JwtAuthGuard, ReviewOwnerGuard)
  @Delete(':reviewId')
  removeReviewAndUpdateRating(@Param('reviewId') reviewId: string) {
    return this.reviewsService.removeReviewAndUpdateRating(reviewId);
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get('user/:userId')
  getUserAllReviewsByUserId(@Param('userId') userId: string) {
    return this.reviewsService.getUserAllReviewsByUserId(userId);
  }

  @Get('ice-cream/:iceCreamId')
  getIceCreamAllReviews(@Param('iceCreamId') iceCreamId: string) {
    return this.reviewsService.getIceCreamAllReviews(iceCreamId);
  }
}
