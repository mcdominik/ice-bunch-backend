import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { CheckReviewDto } from './dto/check-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RankingStatus } from './types/RankingStatus';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async updateReview(dto: UpdateReviewDto, reviewId: string) {
    const review = await this.getReviewById(reviewId);

    review.content = dto.content;
    review.lastUpdate = new Date();

    if (!dto.rating) {
      return await review.save();
    }

    review.rating = dto.rating;
    return await review.save();
  }

  async createReview(dto: CreateReviewDto) {
    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId,
    });

    if (review) {
      throw new OurHttpException(OurExceptionType.REVIEW_ALREADY_EXISTS);
    }

    const createdReview = new this.reviewModel(dto);

    return await createdReview.save();
  }

  async getReviewById(id: string) {
    return await this.reviewModel.findById(id);
  }

  async getUserAllReviewsByUserId(userId: string) {
    return await this.reviewModel.find({
      userId,
    });
  }

  async getIceCreamAllReviews(iceCreamId: string) {
    return await this.reviewModel.find({
      iceCreamId,
    });
  }

  async findOne(reviewId: string) {
    return await this.reviewModel.findOne({ _id: reviewId });
  }

  async checkIfUserAlreadyReviewed(dto: CheckReviewDto) {
    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId,
    });
    return !review ? false : true;
  }

  async getIceCreamRankingStatus(iceCreamId: string): Promise<RankingStatus> {
    const reviews = await this.getIceCreamAllReviews(iceCreamId);
    if (!reviews)
      return {
        averageRating: 0,
        numberOfReviews: 0,
      };

    let totalRating = reviews.reduce(
      (sum: number, review: Review) => sum + review.rating,
      0,
    );
    return {
      averageRating: totalRating / reviews.length,
      numberOfReviews: reviews.length,
    };
  }

  async removeReview(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new OurHttpException(OurExceptionType.REVIEW_DOES_NOT_EXIST);
    }
    await this.reviewModel.deleteOne({ _id: id });
  }
}
