import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  searchField: string;

  @IsBoolean()
  @IsOptional()
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
