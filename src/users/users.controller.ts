import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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

  @Get('/email/:email')
  getOneByEmail(@Param('email') email: string) {
    return this.usersService.getOneByEmail(email);
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
