import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
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
import { RankingStatus } from 'src/reviews/types/RankingStatus';

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
  const createReview = async ({
    userId = 'test',
    username = 'test',
    iceCreamId = 'test',
    rating = 5,
    lastUpdate = '2020-01-01',
    content = 'test',
  }): Promise<Review> => {
    const dto: CreateReviewDto = {
      userId: userId,
      username: username,
      iceCreamId: iceCreamId,
      rating: rating,
      lastUpdate: lastUpdate,
      content: content,
    };
    const review = await reviewModel.create(dto);
    return review;
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
    // then
    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        userId: user.id,
        username: 'test',
        rating: 5,
        iceCreamId: iceCream.id,
        content: 'test',
        lastUpdate: '2020-01-01T00:00:00.000Z',
      }),
    );
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

    expect(response.body).toEqual(
      expect.objectContaining({
        username: 'test',
        rating: 5,
        iceCreamId: iceCream.id,
        userId: user.id,
        content: null,
        lastUpdate: '2020-01-01T00:00:00.000Z',
      }),
    );

    const id = response.body._id;
    const link = await reviewModel.findById(id);

    expect(link).toBeDefined();
  });

  it('should update review content and rating', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();
    const review = await createReview({
      userId: user._id,
      iceCreamId: iceCream._id,
    });

    const updateReviewDto: UpdateReviewDto = {
      content: 'content changed',
      rating: 1,
    };

    // when
    const response = await request(app.getHttpServer())
      .put(`/reviews/${review._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateReviewDto);

    // then
    expect(response.status).toBe(200);
    expect(response.body.content).toEqual(updateReviewDto.content);
    expect(response.body.rating).toEqual(updateReviewDto.rating);
  });

  it('should delete review', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();
    const review = await createReview({
      userId: user._id,
      iceCreamId: iceCream._id,
    });

    // when
    const response = await request(app.getHttpServer())
      .delete(`/reviews/${review._id}`)
      .set('Authorization', `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);

    const isReview = await reviewModel.findById(review._id);
    expect(isReview).toBeFalsy();
  });

  it('should get ice cream raking status', async () => {
    // given
    const token = await createAndLoginUser('test@test.pl', 'test');
    const user = await usersService.getOneByEmail('test@test.pl');
    const iceCream = await createIceCream();

    await createReview({
      userId: user._id,
      rating: 4.333,
      iceCreamId: iceCream._id,
    });
    await createReview({
      userId: user._id,
      rating: 3.162,
      iceCreamId: iceCream._id,
    });

    // when
    const response = await request(app.getHttpServer())
      .get(`/reviews/ice-cream/ranking-status/${iceCream._id}`)
      .set('Authorization', `Bearer ${token}`);
    const rankingStatus: RankingStatus = response.body;

    expect(response.status).toBe(200);
    expect(rankingStatus.averageRating).toEqual(3.7475);
    expect(rankingStatus.numberOfReviews).toEqual(2);
  });

  afterAll(async () => {
    await app.close();
  });
});
