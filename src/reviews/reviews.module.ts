import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { UsersModule } from 'src/users/users.module';
import { IceCreamsModule } from 'src/ice-creams/ice-creams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UsersModule,
    IceCreamsModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
