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


@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly usersService: UsersService,
    private readonly iceCreamService: IceCreamsService,

    ) {}

  async createOrUpdateReview(dto: CreateReviewDto) {
    // they throw CastError if userid or icecreamid is wrong
    await this.usersService.getOneById(dto.userId)
    const iceCream = await this.iceCreamService.getOneById(dto.iceCreamId)

    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId
    })
    if (!review) {
      const createdReview = new this.reviewModel(dto);
      iceCream.rating = (iceCream.rating + dto.rating) / (iceCream.number_of_ratings+1)
      iceCream.number_of_ratings = iceCream.number_of_ratings + 1
      await iceCream.save()
      return await createdReview.save();
    }
    review.rating = dto.rating,
    review.content = dto.content
    await iceCream.save()
    return await review.save()

  }

  async getReviewById(id: string) {
    return await this.reviewModel.findById(id);
  }

  async getUserAllReviews(userId: string) {
    return await this.reviewModel.find({
      userId
    })
  }

  async getIceCreamAllReviews(iceCreamId: string) {
    return await this.reviewModel.find({
      iceCreamId
    })
  }

  async findOne(reviewId: string) {
    return await this.reviewModel.findOne({_id: reviewId});
  }

  async checkIfUserAlreadyReviewed(dto: CheckReviewDto) {
    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId
    })
    if (review) return true;
    else return false;
  }

  async removeReviewAndUpdateRanking(id: string) {
    const review = await this.reviewModel.findById(id)

    const iceCream = await this.iceCreamService.getOneById(review.iceCreamId)
    iceCream.rating = (iceCream.rating - review.rating) / (iceCream.number_of_ratings - 1)
    iceCream.number_of_ratings = iceCream.number_of_ratings - 1
    await review.deleteOne()
    await iceCream.save()
    await review.save()
  }
}
