import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop() 
  userId: string;
  @Prop() 
  username: string;
  @Prop()
  iceCreamId: string;
  @Prop()
  content: string;
  @Prop()
  rating: number;
  @Prop()
  lastUpdate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);