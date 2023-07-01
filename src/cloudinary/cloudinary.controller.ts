import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Param
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
  
  @Controller('image')
  export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('upload/:userId')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Param('userId') userId: string
    ) {
      return this.cloudinaryService.uploadFile(file, userId);
    }
  }