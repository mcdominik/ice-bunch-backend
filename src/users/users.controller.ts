import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDtoFromFrontend } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getOneById(@Param('id') userId: string) {
    return this.usersService.getOneById(userId);
  }

  @Post()
  createVerifiedByOauthProvider(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.createVerifiedByOauthProvider(createUserDto);
  }

  @Post()
  createUnverified(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.createUnverified(createUserDto);
  }
}
