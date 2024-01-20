import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { AppModule } from 'src/app.module';

import { Review, ReviewDocument } from 'src/reviews/entities/review.entity';
import {
  UserDocument,
  User,
  AccountType,
} from 'src/users/entities/user.entity';
import {
  IceCream,
  IceCreamDocument,
} from 'src/ice-creams/entities/ice-cream.entity';
import { UsersService } from 'src/users/users.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import {
  CreateIceCreamDto,
  IceCreamType,
} from 'src/ice-creams/dto/create-ice-cream.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';

describe('reviews', () => {
  let app: INestApplication;
  let reviewModel: Model<ReviewDocument>;
  let usersService: UsersService;
  let userModel: Model<UserDocument>;
  let reviewsService: ReviewsService;
  let iceCreamModel: Model<IceCreamDocument>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule.forRoot({
          mongoHost: process.env.MONGO_HOST_TEST,
          mongoPassword: process.env.MONGO_PASSWORD_TEST,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    reviewModel = app.get(getModelToken(Review.name));

    userModel = app.get(getModelToken(User.name));
    iceCreamModel = app.get(getModelToken(IceCream.name));
    usersService = app.get(UsersService);
    reviewsService = app.get(ReviewsService);
  });

  beforeEach(async () => {
    await userModel.deleteMany();
    await reviewModel.deleteMany();
    await iceCreamModel.deleteMany();
  });

  const createAndLoginUser = async (email: string, password: string) => {
    await usersService.createUnverified({
      email,
      password,
      accountType: AccountType.EMAIL,
      username: 'test',
    });

    const user = await usersService.getOneByEmail(email);
    user.emailConfirmed = true;
    await user.save();
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      });

    return response.body.token;
  };

  const createIceCream = async () => {
    const dto: CreateIceCreamDto = {
      brand_pl: 'brand_pl',
      name_pl: 'name_pl',
      description_pl: 'description_pl',
      brand_en: 'brand_en',
      name_en: 'name_en',
      description_en: 'description_en',
      rating: 4,
      numberOfRatings: 4,
      image: 'image',
      vegan: true,
      type: IceCreamType.PINT,
      tags: ['tag1', 'tag2'],
      barcode: 'barcode',
    };
    return await iceCreamModel.create(dto);
  };

  it('100', async () => {
    // given
    expect(1).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
