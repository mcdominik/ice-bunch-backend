import { IsBoolean, IsString } from 'class-validator';

export class SearchQueryDto {
    @IsString()
    searchField: string;
    @IsBoolean()
    isVegan: boolean;
}

