import { Inject, Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchQueryDto, Sort } from './dto/search-query.dto';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { IceCreamQuery } from './types/ice-cream.query';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class IceCreamsService {
  private ICES_ON_PAGE = 20;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>,
  ) {}

  async addNew(dto: CreateIceCreamDto) {
    const newIceCream = new this.iceCreamModel(dto);
    await newIceCream.save();
  }

  async getOneById(iceCreamId: string) {
    const iceCream = this.iceCreamModel.findById(iceCreamId);
    if (!iceCream) {
      throw new OurHttpException(OurExceptionType.ICE_CREAM_DOES_NOT_EXIST);
    }
    return iceCream;
  }

  mapSortKeyToSortKeys(sortType: Sort) {
    switch (sortType) {
      case Sort.DECREASING:
        return { rating: 1, numberOfRatings: -1, _id: -1 };
      case Sort.INCREASING:
        return { rating: -1, numberOfRatings: -1, _id: -1 };
      case Sort.MOST_POPULAR:
        return { numberOfRatings: -1, rating: 1, _id: -1 };
      default:
        throw new OurHttpException(OurExceptionType.UNKNOW_SORTING_KEY);
    }
  }
  async findAndSortWithPagination(dto: SearchQueryDto): Promise<IceCreamQuery> {
    const totalEntitiesCount = await this.iceCreamModel.count();
    const queryEntitiesCount = await this.getCountMatchingSearchQuery(dto);
    const iceCreams = await this.getEntitiesMatchingSearchQuery(dto);

    return {
      iceCreams,
      meta: { totalEntitiesCount, queryEntitiesCount },
    };
  }

  async getEntitiesMatchingSearchQuery(dto: SearchQueryDto) {
    const sortKeys: any = this.mapSortKeyToSortKeys(dto.sortType);
    const searchFieldFilter = this.getSearchFieldFilter(dto.searchField);

    const iceCreams = await this.iceCreamModel
      .find({
        $and: [
          {
            $or: searchFieldFilter,
          },
          dto.isVegan ? { vegan: dto.isVegan } : {},
        ],
      })
      .sort(sortKeys)
      .limit(this.ICES_ON_PAGE)
      .skip((dto.page - 1) * this.ICES_ON_PAGE);
    return iceCreams;
  }

  async getCountMatchingSearchQuery(dto: SearchQueryDto) {
    const searchFieldFilter = this.getSearchFieldFilter(dto.searchField);
    const queryEntitiesCount: number = await this.iceCreamModel
      .find({
        $and: [
          {
            $or: searchFieldFilter,
          },
          dto.isVegan ? { vegan: dto.isVegan } : {},
        ],
      })
      .count();
    return queryEntitiesCount;
  }

  getSearchFieldFilter(searchField: string) {
    const fieldRegex = new RegExp(searchField, 'i');
    return [
      { brand_pl: { $regex: fieldRegex } },
      { name_pl: { $regex: fieldRegex } },
      { tags: { $regex: fieldRegex } },
      { brand_en: { $regex: fieldRegex } },
      { name_en: { $regex: fieldRegex } },
    ];
  }
}
