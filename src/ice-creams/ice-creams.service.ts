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

  async findBySignificantProperties(searchQuery: string, veganOnly: boolean) {
    if (!veganOnly) {
    const iceCreams = await this.iceCreamModel.find({
      $or: [
        { brand: { $regex: new RegExp(searchQuery, "i")} }, 
        { name: { $regex: new RegExp(searchQuery, "i") } }, 
        { description: { $regex: new RegExp(searchQuery, "i") }},
      ],
    })
    return iceCreams
    }
    const iceCreams = await this.iceCreamModel.find({
      $and:
        [{ brand: { $regex: new RegExp(searchQuery, "i")} },
        {$or: [
          { brand: { $regex: new RegExp(searchQuery, "i")} }, 
          { name: { $regex: new RegExp(searchQuery, "i") } }, 
          { description: { $regex: new RegExp(searchQuery, "i") }},
        ]}
      ]
          })
    return iceCreams
  }
}
