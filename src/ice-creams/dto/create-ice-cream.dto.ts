import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIceCreamDto {
    @IsString()
    brand_pl: string;
    @IsString()
    name_pl: string;
    @IsString()
    description_pl: string;
    @IsString()
    brand_en: string;
    @IsString()
    name_en: string;
    @IsString()
    description_en: string;
    @IsNumber()
    rating: number;
    @IsString()
    image: string;
    @IsBoolean()
    vegan: boolean;
    @IsString()
    type: string;
    @IsArray()
    tags: Array<any>;
    @IsOptional()
    barcode: string;
}