import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { UsersModule } from 'src/users/users.module';
import { IceCreamsModule } from 'src/ice-creams/ice-creams.module';
import {
  IceCream,
  IceCreamSchema,
} from 'src/ice-creams/entities/ice-cream.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: IceCream.name, schema: IceCreamSchema },
    ]),
    UsersModule,
    IceCreamsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
