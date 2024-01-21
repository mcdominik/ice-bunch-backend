import { Module } from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { IceCreamsController } from './ice-creams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IceCreamSchema, IceCream } from './entities/ice-cream.entity';
// import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IceCream.name, schema: IceCreamSchema },
    ]),
    // ReviewsModule,
  ],
  controllers: [IceCreamsController],
  providers: [IceCreamsService],
  exports: [IceCreamsService],
})
export class IceCreamsModule {}
