import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';

@Controller('ice-creams')
export class IceCreamsController {
  constructor(private readonly iceCreamsService: IceCreamsService) {}

  @Post()
  create(@Body() createIceCreamDto: CreateIceCreamDto) {
    return this.iceCreamsService.create(createIceCreamDto);
  }

  @Get()
  findAll() {
    return this.iceCreamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iceCreamsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iceCreamsService.remove(+id);
  }
}
