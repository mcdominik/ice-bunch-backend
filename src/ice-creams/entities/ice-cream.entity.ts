import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IceCreamDocument = HydratedDocument<IceCream>;

export class Languages {
  pl: { name: String; description: String; brand: String };
  en: { name: String; description: String; brand: String };
}

@Schema()
export class IceCream {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  brand: string;

  @Prop()
  rating: number;

  @Prop()
  image: string;

  @Prop()
  vegan: boolean;

  @Prop()
  tags: Array<string>;

  languages: Languages;
}

export const IceCreamSchema = SchemaFactory.createForClass(IceCream);
