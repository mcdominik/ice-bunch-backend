import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class SearchQueryDto {
    @IsString()
    searchField: string;
    @IsBoolean()
    isVegan: boolean;
    @IsNumber()
    sortKey: number;
    @IsNumber()
    page: number;
}

