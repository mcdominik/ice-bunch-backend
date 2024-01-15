import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { UsersService } from 'src/users/users.service';
import { IceCreamsService } from 'src/ice-creams/ice-creams.service';
import { CheckReviewDto } from './dto/check-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly iceCreamService: IceCreamsService,
  ) {}

  async updateReviewAndUpdateRating(dto: UpdateReviewDto, reviewId: string) {
    const review = await this.getReviewById(reviewId);
    console.log(`revie out:${review}`);

    review.content = dto.content;
    review.lastUpdate = new Date();
    if (!dto.rating) {
      return await review.save();
    }
    console.log(
      await this.iceCreamService.updateIceCreamRatingAfterUpdatedReview(review),
    );
    review.rating = dto.rating;
    return await review.save();
  }

  async createReviewAndUpdateRating(dto: CreateReviewDto) {
    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId,
    });
    if (review) {
      throw new OurHttpException(OurExceptionType.REVIEW_ALREADY_EXISTS);
    }

    const createdReview = new this.reviewModel(dto);

    await this.iceCreamService.updateIceCreamRatingAfterNewReview(
      createdReview,
    );

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

  async removeReviewAndUpdateRating(id: string) {
    const review = await this.reviewModel.findById(id);

    await this.iceCreamService.updateIceCreamRatingAfterDeletedReview(review);
    await this.reviewModel.deleteOne({ _id: id });
  }
}
