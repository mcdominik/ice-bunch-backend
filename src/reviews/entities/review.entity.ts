import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  _id: string;
  @Prop()
  userId: string;
  @Prop()
  iceCreamId: string;
  @Prop()
  content: string;
  @Prop()
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);