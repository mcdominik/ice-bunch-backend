import { IsAlpha, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchBarPLDto {
    @IsString()
    brand_pl: string;
    @IsString()
    name_pl: string;
    @IsString()
    description_pl: string;
    @IsArray()
    tags: Array<string>;
}

export class SearchBarENDto {
    @IsString()
    brand_en: string;
    @IsString()
    name_en: string;
    @IsString()
    description_en: string;
    @IsArray()
    tags: Array<string>;
}