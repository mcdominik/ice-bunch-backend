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

  // @Get('no-email/:id')
  // getOneWithoutEmailById(@Param('id') userId: string) {
  //   return this.usersService.getOneWithoutEmailById(userId);
  // }

  @Get('/email/:email')
  getOneByEmail(@Param('email') email: string) {
    return this.usersService.getOneByEmail(email);
  }

  // @Post('image/upload/:userId')
  // @UseInterceptors(FileInterceptor('file'))
  // changeAvatarUrl(@UploadedFile() file: Express.Multer.File, @Param('userId') userId: string) {
  //   return this.usersService.changeAvatarUrl(file, userId);
  // }

  @Post()
  createVerifiedByOauthProvider(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.createVerifiedByOauthProvider(createUserDto);
  }

  @Post()
  createUnverified(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.createUnverified(createUserDto);
  }
}
