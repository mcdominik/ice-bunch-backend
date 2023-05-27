import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('ice-creams')
export class IceCreamsController {
  constructor(private readonly iceCreamsService: IceCreamsService) {}

  @Post('add')
  addNew(@Body() dto: CreateIceCreamDto) {
    return this.iceCreamsService.addNew(dto);
  }

  @Post()
  findBySignificantProperties (@Body() dto: SearchQueryDto) {
    return this.iceCreamsService.findBySignificantProperties(dto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.iceCreamsService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.iceCreamsService.remove(+id);
  // }
}
