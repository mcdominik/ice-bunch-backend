import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
    @IsString()
    searchField: string;
    @IsOptional()
    isVegan: boolean;
    @IsNumber()
    sortKey: number;
    @IsNumber()
    page: number;
}

