import { Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IceCreamDocument, IceCream } from './entities/ice-cream.entity';
import { SearchBarENDto, SearchBarPLDto } from './dto/search-bar.dto';

@Injectable()
export class IceCreamsService {
  constructor(@InjectModel(IceCream.name) private iceCreamModel: Model<IceCreamDocument>) {}

  create(createIceCreamDto: CreateIceCreamDto) {
    return 'This action adds a new iceCream';
  }

  async findAll() {
    return this.iceCreamModel.find();
  }

  async findBySignificantPropertiesPL(searchQueryPL: string) {
    console.log(searchQueryPL)
    const iceCreams = await this.iceCreamModel.find({
      $or: [
        { brand_pl: 'ben' }, 
        { name_pl: 'ben' },
        { description_pl: 'ben'}
      ],
    })
    return iceCreams
  }

  async findBySignificantPropertiesEN(searchQueryEN: string) {
    const iceCreams = await this.iceCreamModel.find({
      $or: [
        { brand: { $regex: new RegExp(searchQueryEN, "i")} }, // Case-insensitive search on brand
        { name: { $regex: new RegExp(searchQueryEN, "i") } }, // Case-insensitive search on name
        { description: { $regex: new RegExp(searchQueryEN, "i") }}, // Case-insensitive search on description
      ],
    })
    return iceCreams
  }
}
