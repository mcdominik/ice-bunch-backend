import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchQueryDto {
  @IsString()
  searchField: string;

  @IsOptional()
  isVegan: boolean;

  @IsNotEmpty()
  sortType: Sort;

  @IsNumber()
  page: number;
}

export enum Sort {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  MOST_POPULAR = 'MOST_POPULAR',
}
