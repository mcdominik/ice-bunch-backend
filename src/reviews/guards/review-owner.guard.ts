import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from '../reviews.service';

@Injectable()
export class ReviewOwnerGuard implements CanActivate {
  constructor(private readonly reviewsService: ReviewsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const review = await this.reviewsService.getReviewById(request.params.id);
    const userId = request.user.id;

    if (review.userId === userId) {
      return true;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
