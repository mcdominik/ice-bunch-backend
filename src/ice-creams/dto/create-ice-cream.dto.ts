import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';


export enum IceCreamType {
    PINT = "PINT",
    TUB = "TUB",
    BAR = "BAR",
    CONE = "CONE",
    POPSICLE = 'POPSICLE',
    SANDWICH = 'SANDWICH',
    OTHER = 'OTHER'
  }

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
    @IsNotEmpty()
    type: IceCreamType;
    @IsArray()
    tags: Array<any>;
    @IsOptional()
    barcode: string | null;
}