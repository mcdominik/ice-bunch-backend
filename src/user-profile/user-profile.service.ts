import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument, User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ChangeUsernameDto } from './dto/change-username.dto';

@Injectable()
export class UserProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly cloudinaryService: CloudinaryService,
  private readonly reviewsService: ReviewsService

  )
   {}

  // async getOneByEmail(email: string) {
  //   return await this.userModel.findOne({
  //     email,
  //   });
  // }

  // async getOneById(userId: string) {
  //   return await this.userModel.findById(
  //     userId
  //   )
  // }

  // async getOneWithoutEmailById(userId: string) {
  //   return await this.userModel.findById(
  //     userId
  //   ).select('-email')
  // }

  async changeAvatarUrl(file: Express.Multer.File, userId: string) {
    const response = await this.cloudinaryService.uploadFile(file)
    const user = await this.userModel.findById(userId)
    user.avatarUrl = response.secure_url
    await user.save()
  }

  async changeUsername(dto: ChangeUsernameDto) {
    const user = await this.userModel.findById(dto.userId)
    user.username = dto.newUsername
    await user.save()
    await this.updateUsernameInsideReviews(dto)
  }
  
  async updateUsernameInsideReviews(dto: ChangeUsernameDto) {
    const reviews = await this.reviewsService.getUserAllReviewsByUserId(dto.userId)
    for (const review of reviews) {
      review.username = dto.newUsername
      await review.save()
    }
  }

  async getOneWithoutEmailById(userId: string) {
    return await this.userModel.findById(
      userId
    ).select('-email')
  }
}
