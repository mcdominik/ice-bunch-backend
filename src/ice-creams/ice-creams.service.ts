import { Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchQueryDto } from './dto/search-query.dto';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';

@Injectable()
export class IceCreamsService {
  constructor(@InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>) {}

  async addNew(dto: CreateIceCreamDto) {
    const newIceCream = new this.iceCreamModel(dto);
    await newIceCream.save();
  }

  async findAndSortWithPagination(dto: SearchQueryDto) {

    const ICES_ON_PAGE: number  = 24 

    const field_regex = new RegExp(dto.searchField, "i")
    if (dto.sortKey != 1 && dto.sortKey != -1) {
      throw new OurHttpException(OurExceptionType.UNKNOW_SORTING_KEY);
    }

    const sortKey_ = dto.sortKey
    if (dto.isVegan) {
      const iceCreams = await this.iceCreamModel.find({
        $and: [{
          $or: [
            { brand_pl: { $regex: field_regex} }, 
            { name_pl: { $regex: field_regex} }, 
            { description_pl: { $regex: field_regex} },
            { brand_en: { $regex: field_regex} }, 
            { name_en: { $regex: field_regex} }, 
            { description_en: { $regex: field_regex} },
          ]},
          {vegan: dto.isVegan}
        ]
      }).sort({rating: sortKey_}).limit(24).skip((dto.page-1)*ICES_ON_PAGE)
      return iceCreams
    } else {
      const iceCreams = await this.iceCreamModel.find({
          $or: [
            { brand_pl: { $regex: field_regex} }, 
            { name_pl: { $regex: field_regex} }, 
            { description_pl: { $regex: field_regex} },
            { brand_en: { $regex: field_regex} }, 
            { name_en: { $regex: field_regex} }, 
            { description_en: { $regex: field_regex} },
          ]
      }).sort({rating: sortKey_}).limit(24).skip((dto.page-1)*ICES_ON_PAGE)
      return iceCreams
    }

  }

  async getOneById(iceCreamId: string) {
    return await this.iceCreamModel.findById(iceCreamId);
  }
}
