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
import { IceCreamsService } from 'src/ice-creams/ice-creams.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly iceCreamService: IceCreamsService,
  ) {}

  @UseGuards(JwtAuthGuard, ReviewOwnerGuard)
  @Put(':reviewId')
  async updateReviewAndRankingStatus(
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.updateReview(dto, reviewId);
    await this.reviewsService.updateIceCreamRankingStatus(review.iceCreamId);
    return review;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReviewAndUpdateRankingStatus(@Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.createReview(dto);
    await this.reviewsService.updateIceCreamRankingStatus(dto.iceCreamId);
    return review;
  }

  @UseGuards(JwtAuthGuard, ReviewOwnerGuard)
  @Delete(':reviewId')
  async removeReviewAndUpdateRankingStatus(
    @Param('reviewId') reviewId: string,
  ) {
    const review = await this.reviewsService.removeReview(reviewId);

    await this.reviewsService.updateIceCreamRankingStatus(review.iceCreamId);
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

  @Get('ice-cream/ranking-status/:iceCreamId')
  getIceCreamRankingStatus(@Param('iceCreamId') iceCreamId: string) {
    return this.reviewsService.getIceCreamRankingStatus(iceCreamId);
  }
}
