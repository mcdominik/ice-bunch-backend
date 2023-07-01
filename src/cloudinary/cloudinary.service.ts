import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile_old(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
    folder: 'avatars',
    public_id: userId, // Specify the public_id of the existing image
    overwrite: true, // Set the `overwrite` option to true
  });

  return uploadResponse;
  }
}
