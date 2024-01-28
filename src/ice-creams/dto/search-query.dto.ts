import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  searchField: string;

  @IsOptional()
  isVegan: boolean | string;

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
