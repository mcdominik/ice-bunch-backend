import { Controller, Get, Param, UseInterceptors, Query } from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('ice-creams')
export class IceCreamsController {
  constructor(private readonly iceCreamsService: IceCreamsService) {}

  // @Post('add')
  // addNew(@Body() dto: CreateIceCreamDto) {
  //   return this.iceCreamsService.addNew(dto);
  // }

  @Get()
  findAndSortWithPagination(@Query() dto: SearchQueryDto) {
    return this.iceCreamsService.findAndSortWithPagination(dto);
  }

  @Get(':id')
  getOneById(@Param('id') iceCreamId: string) {
    return this.iceCreamsService.getOneById(iceCreamId);
  }
}
