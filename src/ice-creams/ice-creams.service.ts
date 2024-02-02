import { Inject, Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchQueryDto, Sort } from './dto/search-query.dto';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { IceCreamQuery } from './types/ice-cream.query';

@Injectable()
export class IceCreamsService {
  private ICES_ON_PAGE = 20;
  constructor(
    @InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>,
  ) {}

  async addNew(dto: CreateIceCreamDto) {
    const newIceCream = new this.iceCreamModel(dto);
    return await newIceCream.save();
  }

  async getOneById(iceCreamId: string) {
    if (!mongoose.isValidObjectId(iceCreamId)) {
      throw new OurHttpException(OurExceptionType.INVALID_OBJECT_ID);
    }

    const iceCream = await this.iceCreamModel.findById(iceCreamId);

    if (!iceCream) {
      throw new OurHttpException(OurExceptionType.ICE_CREAM_DOES_NOT_EXIST);
    }
    return iceCream;
  }

  async getOneByUrl(url: string) {
    console.log(url);
    const iceCream = await this.iceCreamModel.findOne({ url });

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

  validateIsVegan(isVegan: boolean | string) {
    switch (isVegan) {
      case true:
      case 'true':
        return true;
      case false:
      case 'false':
        return false;
      case undefined:
      case 'undefined':
      case null:
      case '':
        return undefined;
      default:
        throw new OurHttpException(OurExceptionType.IS_VEGAN_WRONG_FORMAT);
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
    const veganQuery = this.validateIsVegan(dto.isVegan);

    const iceCreams = await this.iceCreamModel
      .find({
        $and: [
          {
            $or: searchFieldFilter,
          },
          veganQuery !== undefined ? { vegan: veganQuery } : {},
        ],
      })
      .sort(sortKeys)
      .limit(this.ICES_ON_PAGE)
      .skip((dto.page - 1) * this.ICES_ON_PAGE);
    return iceCreams;
  }

  async getCountMatchingSearchQuery(dto: SearchQueryDto) {
    const searchFieldFilter = this.getSearchFieldFilter(dto.searchField);
    const veganQuery = this.validateIsVegan(dto.isVegan);

    const queryEntitiesCount: number = await this.iceCreamModel
      .find({
        $and: [
          {
            $or: searchFieldFilter,
          },
          veganQuery !== undefined ? { vegan: veganQuery } : {},
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
