import { Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class IceCreamsService {
  constructor(@InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>) {}

  async addNew(dto: CreateIceCreamDto) {
    const newIceCream = new this.iceCreamModel(dto);
    await newIceCream.save();
  }


  async findBySignificantProperties(dto: SearchQueryDto) {
    const field_regex = new RegExp(dto.searchField, "i")
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
    }) 
    return iceCreams
  }

  async sortIncreasing(iceCreams: object) {
    
  }

  async pagination(size: number, iceCreams: object) {
    const total = Object(iceCreams).length
  }


  async findAll() {
    return this.iceCreamModel.find();
  }
}
