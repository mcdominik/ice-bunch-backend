import { Injectable } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';

@Injectable()
export class IceCreamsService {
  create(createIceCreamDto: CreateIceCreamDto) {
    return 'This action adds a new iceCream';
  }

  findAll() {
    return `This action returns all iceCreams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} iceCream`;
  }


  remove(id: number) {
    return `This action removes a #${id} iceCream`;
  }
}
