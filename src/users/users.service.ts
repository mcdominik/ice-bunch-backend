import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  CreateUserDtoFromFrontend,
} from './dto/create-user.dto';
import { User, UserDocument, AccountType } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';
import { OurHttpException } from 'src/common/errors/OurHttpException';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  createVerifiedByOauthProvider(createUserDto: CreateUserDtoFromFrontend) {
    const dtoWithHash: CreateUserDto = {
      email: createUserDto.email,
      passwordHash: this.hashPassword(createUserDto.password),
      emailConfirmed: true,
      accountType: createUserDto.accountType,
    };

    const createdUser = new this.userModel(dtoWithHash);
    return createdUser.save();
  }

  async createUnverified(createUserDto: CreateUserDtoFromFrontend) {
    const token = uuidv4();

    const dtoWithHash: CreateUserDto = {
      email: createUserDto.email,
      passwordHash: this.hashPassword(createUserDto.password),
      emailConfirmed: false,
      emailConfirmationToken: token,
      accountType: AccountType.EMAIL,
    };
    if (await this.getOneByEmail(createUserDto.email)) {
      throw new OurHttpException(OurExceptionType.USER_ALREADY_EXISTS);
    }
    const createdUser = new this.userModel(dtoWithHash);
    return createdUser.save();
  }

  hashPassword(password: string) {
    return hashSync(password, 10);
  }

  getOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  getOneById(userId: string) {
    return this.userModel.findById(
      userId
    )
  }

  async tryVerifyEmailByToken(token: string) {
    const user = await this.userModel.findOne({
      emailConfirmationToken: token,
    });

    if (!user) {
      throw new OurHttpException(OurExceptionType.INVALID_TOKEN);
    }

    user.emailConfirmed = true;
    await user.save();
  }

  async trySetNewPasswordByToken(token: string, newPassword: string) {
    if (!token || token == '') {
      throw new OurHttpException(OurExceptionType.INVALID_TOKEN);
    }
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new OurHttpException(OurExceptionType.INVALID_TOKEN);
    }

    user.passwordHash = this.hashPassword(newPassword);
    user.resetPasswordToken = null;
    await user.save();
  }

  async tryAddResetPasswordToken(email: string) {
    const user = await this.userModel.findOne({
      email,
    });
    if (!user.emailConfirmed) {
      throw new OurHttpException(
        OurExceptionType.LOGIN_EMAIL_CONFIRMATION_REQUIRED,
      );
    }
    const token = uuidv4();
    user.resetPasswordToken = token;
    await user.save();
    return user;
  }
}
