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
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
require('dotenv').config();

describe('users', () => {
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

  const createAndLoginUser = async (email: string, password: string) => {
    await usersService.createUnverified({
      email,
      password,
      username: 'test',
      accountType: AccountType.EMAIL,
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

  it('should delete user', async () => {
    // given
    const email = 'test@test.pl';

    const token = await createAndLoginUser(email, 'test');

    // when
    const response = await request(app.getHttpServer())
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`);
    // then
    expect(response.status).toBe(200);

    const isUser = await usersService.getOneByEmail(email);
    expect(isUser).toBeFalsy();
  });

  it('should change user password', async () => {
    // given
    const email = 'test@test.pl';
    const password = 'Test123!';
    const newPassword = 'NewPassword123!';
    const token = await createAndLoginUser(email, password);
    const changePasswordDto: ChangePasswordDto = {
      oldPassword: password,
      newPassword: newPassword,
    };
    // when
    const response = await request(app.getHttpServer())
      .post('/users/me/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: changePasswordDto.oldPassword,
        newPassword: changePasswordDto.newPassword,
      });

    // then
    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
