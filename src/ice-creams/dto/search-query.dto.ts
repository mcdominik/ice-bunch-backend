import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  searchField: string;

  @IsBoolean()
  @Type(() => Boolean)
  isVegan: boolean;

  @IsNotEmpty()
  sortType: Sort;

  @IsInt()
  @Type(() => Number)
  page: number;
}

export enum Sort {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  MOST_POPULAR = 'MOST_POPULAR',
}
