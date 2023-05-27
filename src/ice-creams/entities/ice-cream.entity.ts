import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type IceCreamDocument = HydratedDocument<IceCream>;

@Schema()
export class IceCream {
    _id: string;
    @Prop()
    brand_pl: string;
    @Prop()
    name_pl: string;
    @Prop()
    description_pl: string;
    @Prop()
    brand_en: string;
    @Prop()
    name_en: string;
    @Prop()
    description_en: string;
    @Prop()
    rating: number;
    @Prop()
    image: string;
    @Prop()
    vegan: boolean; 
    @Prop()
    type: string; 
    @Prop()
    tags: Array<string>;
    @Prop()
    @IsOptional()
    barcode: string;
}

export const IceCreamSchema = SchemaFactory.createForClass(IceCream);