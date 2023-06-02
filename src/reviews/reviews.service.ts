import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { RemoveReviewDto } from './dto/remove-review.dto';
import { UsersService } from 'src/users/users.service';
import { IceCreamsService } from 'src/ice-creams/ice-creams.service';


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

  async removeReview(dto: RemoveReviewDto) {
    const review = await this.reviewModel.findOne({
      userId: dto.userId,
      iceCreamId: dto.iceCreamId
    })
    await review.deleteOne()
    await review.save()
  }
}
