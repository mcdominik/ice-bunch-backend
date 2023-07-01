import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image/upload/:userId')
  @UseInterceptors(FileInterceptor('file'))
  changeAvatarUrl(@UploadedFile() file: Express.Multer.File, @Param('userId') userId: string) {
    return this.userProfileService.changeAvatarUrl(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/new-username')
  changeUsername(@Body() dto: ChangeUsernameDto) { 
    return this.userProfileService.changeUsername(dto)
  }

  @Get('no-email/:id')
  getOneWithoutEmailById(@Param('id') userId: string) {
    return this.userProfileService.getOneWithoutEmailById(userId);
  }

}
