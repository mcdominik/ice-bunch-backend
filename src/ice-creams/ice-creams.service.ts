import { Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchQueryDto } from './dto/search-query.dto';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class IceCreamsService {
  constructor(
    @InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>,
    private readonly reviewService: ReviewsService,
  ) {}

  async addNew(dto: CreateIceCreamDto) {
    const newIceCream = new this.iceCreamModel(dto);
    await newIceCream.save();
  }

  async getOneById(iceCreamId: string) {
    return await this.iceCreamModel.findById(iceCreamId);
  }

  async findAndSortWithPagination(dto: SearchQueryDto) {
    const ICES_ON_PAGE: number = 20;

    const field_regex = new RegExp(dto.searchField, 'i');

    if (dto.sortKey != 1 && dto.sortKey != -1 && dto.sortKey != -2) {
      throw new OurHttpException(OurExceptionType.UNKNOW_SORTING_KEY);
    }

    const totalEntitiesCount: number = await this.iceCreamModel.count();

    const const_query = [
      { brand_pl: { $regex: field_regex } },
      { name_pl: { $regex: field_regex } },
      { tags: { $regex: field_regex } },
      { brand_en: { $regex: field_regex } },
      { name_en: { $regex: field_regex } },
    ];

    let sortKeys;
    switch (dto.sortKey) {
      case -1:
        sortKeys = { rating: -1, numberOfRatings: -1, _id: -1 };
        break;
      case 1:
        sortKeys = { rating: 1, numberOfRatings: -1, _id: -1 };
        break;
      // case 2:
      //   sortKeys = {numberOfRatings: -1, rating: -1, _id: -1}
      //   break;
      case -2:
        sortKeys = { numberOfRatings: -1, rating: -1, _id: -1 };
        break;
    }

    if (dto.isVegan) {
      const queryEntitiesCount: number = await this.iceCreamModel
        .find({
          $and: [
            {
              $or: const_query,
            },
            { vegan: dto.isVegan },
          ],
        })
        .count();

      const iceCreams = await this.iceCreamModel
        .find({
          $and: [
            {
              $or: const_query,
            },
            { vegan: dto.isVegan },
          ],
        })
        .sort(sortKeys)
        .limit(ICES_ON_PAGE)
        .skip((dto.page - 1) * ICES_ON_PAGE);
      return { iceCreams, meta: { totalEntitiesCount, queryEntitiesCount } };
    } else {
      const queryEntitiesCount: number = await this.iceCreamModel
        .find({
          $or: const_query,
        })
        .count();

      const iceCreams = await this.iceCreamModel
        .find({
          $or: const_query,
        })
        .sort(sortKeys)
        .limit(ICES_ON_PAGE)
        .skip((dto.page - 1) * ICES_ON_PAGE);

      return { iceCreams, meta: { totalEntitiesCount, queryEntitiesCount } };
    }
  }
}
