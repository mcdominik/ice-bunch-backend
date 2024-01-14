import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import {
  AccountType,
  User,
  UserDocument,
} from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import * as nock from 'nock';
require('dotenv').config();

describe('auth', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let userModel: Model<UserDocument>;

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
    await app.init();

    userModel = app.get(getModelToken(User.name));
    usersService = app.get(UsersService);
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  it('should log in user (standard login)', async () => {
    // given
    const email = 'test@test.pl';
    const password = 'test';

    await usersService.createUnverified({
      email,
      password,
      username: 'test',
      accountType: AccountType.EMAIL,
    });

    const user = await usersService.getOneByEmail(email);
    user.emailConfirmed = true;
    await user.save();

    // when
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      });

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accountType: AccountType.EMAIL,
      token: expect.any(String),
      email,
    });
  });

  it('should log in user (google login)', async () => {
    // given
    const googleToken = 'test_google_token';
    const email = 'test@test.pl';
    const password = 'test';

    nock('https://www.googleapis.com')
      .post(`/oauth2/v3/tokeninfo?access_token=${googleToken}`)
      .reply(200, {
        email,
      });

    await usersService.createVerifiedByOauthProvider({
      email,
      password,
      username: 'test',
      accountType: AccountType.GOOGLE,
    });

    // when
    const response = await request(app.getHttpServer())
      .post('/auth/google/login')
      .send({
        googleToken,
      });

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accountType: AccountType.GOOGLE,
      token: expect.any(String),
      email,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
