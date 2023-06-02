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

  createVerifiedByOauthProvider(dto: CreateUserDtoFromFrontend) {
    const username = dto.email.split("@")[0]
    const dtoWithHash: CreateUserDto = {
      email: dto.email,
      passwordHash: this.hashPassword(dto.password),
      emailConfirmed: true,
      accountType: dto.accountType,
      username: username,
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Tony_Ferguson_2019.jpg"
    };

    const createdUser = new this.userModel(dtoWithHash);
    return createdUser.save();
  }

  async createUnverified(dto: CreateUserDtoFromFrontend) {
    const token = uuidv4();
    const username = dto.email.split("@")[0]
    const dtoWithHash: CreateUserDto = {
      email: dto.email,
      passwordHash: this.hashPassword(dto.password),
      emailConfirmed: false,
      emailConfirmationToken: token,
      accountType: AccountType.EMAIL,
      username: username,
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Tony_Ferguson_2019.jpg"
      
    };
    if (await this.getOneByEmail(dto.email)) {
      throw new OurHttpException(OurExceptionType.USER_ALREADY_EXISTS);
    }
    const createdUser = new this.userModel(dtoWithHash);
    return createdUser.save();
  }

  hashPassword(password: string) {
    return hashSync(password, 10);
  }

  async getOneByEmail(email: string) {
    return await this.userModel.findOne({
      email,
    });
  }

  async getOneById(userId: string) {
    return await this.userModel.findById(
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
