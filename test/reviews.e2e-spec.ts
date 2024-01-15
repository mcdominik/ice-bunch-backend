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

  it('should create new review with content', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();
    const createReviewDto: CreateReviewDto = {
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: 'test',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(createReviewDto);
    console.log(response.body);
    // then
    expect(response.status).toBe(201);

    expect(response.body).toContain({
      // __v: expect.any(Number),
      // _id: expect.any(Types.ObjectId),
      userId: user._id,
      username: 'test',
      iceCreamId: iceCream._id,
      rating: 5,
      lastUpdate: '2020-01-01T00:00:00.000Z',
      content: 'test',
    });

    const id = response.body._id;
    const link = await reviewModel.findById(id);

    expect(link).toBeDefined();
  });

  it('should create new review without content', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();
    const createReviewDto: CreateReviewDto = {
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: null,
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(createReviewDto);
    // then
    expect(response.status).toBe(201);

    expect(response.body).toContain({
      // __v: expect.any(Number),
      // _id: expect.any(Types.ObjectId),
      userId: user._id,
      username: 'test',
      iceCreamId: iceCream._id,
      rating: 5,
      lastUpdate: '2020-01-01T00:00:00.000Z',
      content: 'test',
    });

    const id = response.body._id;
    const link = await reviewModel.findById(id);

    expect(link).toBeDefined();
  });

  it('should update review content and rating', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();

    const review = await reviewModel.create({
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: 'test',
    });

    const updateReviewDto: UpdateReviewDto = {
      content: 'test changed',
      rating: 4,
    };
    // when
    const response = await request(app.getHttpServer())
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateReviewDto);

    // then
    expect(response.status).toBe(200);

    const reviewAfterRequest = await reviewModel.findById(review.id);
    expect(reviewAfterRequest.content).toEqual(updateReviewDto.content);
  });

  it('should delete review', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();

    const review = await reviewModel.create({
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: 'test',
    });
    console.log(review.id);
    // when
    const response = await request(app.getHttpServer())
      .delete(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);

    const isReview = await reviewModel.findById(review.id);
    expect(isReview).toBeFalsy();
  });

  it('should update review content', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();

    const review = await reviewModel.create({
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: 'test',
    });

    const updateReviewDto: UpdateReviewDto = {
      content: 'test changed',
      rating: null,
    };

    // when
    const response = await request(app.getHttpServer())
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateReviewDto);

    // then
    expect(response.status).toBe(200);

    const reviewAfterRequest = await reviewModel.findById(review.id);
    expect(reviewAfterRequest.content).toEqual(updateReviewDto.content);
  });

  it('should delete review', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();

    const review = await reviewModel.create({
      userId: user.id,
      username: 'test',
      iceCreamId: iceCream.id,
      rating: 5,
      lastUpdate: '2020-01-01',
      content: 'test',
    });
    console.log(review.id);
    // when
    const response = await request(app.getHttpServer())
      .delete(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);

    const isReview = await reviewModel.findById(review.id);
    expect(isReview).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
