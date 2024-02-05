import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDtoFromFrontend } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/email/:email')
  getOneByEmail(@Param('email') email: string) {
    return this.usersService.getOneByEmail(email);
  }

  @Post()
  createVerifiedByOauthProvider(
    @Body() createUserDto: CreateUserDtoFromFrontend,
  ) {
    return this.usersService.createVerifiedByOauthProvider(createUserDto);
  }

  @Post()
  createUnverified(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.createUnverified(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getOneByIdFromToken(@Req() req) {
    const user = req.user;
    return this.usersService.getOneById(user.id);
  }

  @Get(':id')
  getOneById(@Param('id') userId: string) {
    return this.usersService.getOneById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  deleteUser(@Req() req) {
    const user = req.user;
    return this.usersService.deleteUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/me/change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    const user = req.user;
    return await this.usersService.tryChangePassword(dto, user.id);
  }
}
