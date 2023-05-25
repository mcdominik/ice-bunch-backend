import {
  BadRequestException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { OurExceptionType } from './OurExceptionType';

export class OurHttpException extends HttpException {
  constructor(message: OurExceptionType) {
    super(message, 420);
  }
}
