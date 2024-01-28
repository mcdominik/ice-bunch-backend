import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Query,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseInterceptors(CacheInterceptor)
@Controller('ice-creams')
export class IceCreamsController {
  constructor(private readonly iceCreamsService: IceCreamsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('add')
  addNew(@Body() dto: CreateIceCreamDto) {
    return this.iceCreamsService.addNew(dto);
  }

  @Get()
  findAndSortWithPagination(@Query() dto: SearchQueryDto) {
    return this.iceCreamsService.findAndSortWithPagination(dto);
  }

  @Get(':id')
  getOneById(@Param('id') iceCreamId: string) {
    return this.iceCreamsService.getOneById(iceCreamId);
  }

  @Get('url/:url')
  getOneByUrl(@Param('url') url: string) {
    return this.iceCreamsService.getOneByUrl(url);
  }
}
