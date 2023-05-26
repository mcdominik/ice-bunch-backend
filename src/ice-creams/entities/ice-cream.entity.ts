import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IceCreamDocument = HydratedDocument<IceCream>;

export class Languages {
  pl: { name: String; description: String; brand: String };
  en: { name: String; description: String; brand: String };
}

@Schema()
export class IceCream {
  _id: String;

  @Prop()
  name: String;

  @Prop()
  description: String;

  @Prop()
  brand: String;

  @Prop()
  rating: Number;

  @Prop()
  image: String;

  @Prop()
  vegan: Boolean;

  @Prop()
  tags: Array<String>;

  languages: Languages;
}

export const IceCreamSchema = SchemaFactory.createForClass(IceCream);
