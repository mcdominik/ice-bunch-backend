import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserDtoFromFrontend,
} from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MailsService } from 'src/mails/mails.service';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
import { NewPasswordDto } from 'src/users/dto/new-password.dto';
import { OurHttpException } from 'src/common/errors/OurHttpException';
import { OurExceptionType } from 'src/common/errors/OurExceptionType';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailsService: MailsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    const user = await this.usersService.getOneByEmail(req.user.email);

    if (!user.emailConfirmed) {
      throw new OurHttpException(
        OurExceptionType.LOGIN_EMAIL_CONFIRMATION_REQUIRED,
      );
    }

    return this.authService.login(user);
  }

  @Post('google/login')
  async googleLogin(@Body() body: GoogleBody) {
    return this.authService.googleLogin(body.googleToken);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDtoFromFrontend) {
    const user = await this.usersService.createUnverified(dto);
    await this.mailsService.sendEmailConfirmation(
      user.email,
      user.emailConfirmationToken,
    );
    return await this.authService.login(user);
  }

  @Post('reset-password-email')
  async resetPasswordEmail(@Body() dto: ResetPasswordDto) {
    const userUpdated = await this.usersService.tryAddResetPasswordToken(
      dto.email,
    );
    await this.mailsService.sendEmailResetPassword(
      userUpdated.email,
      userUpdated.resetPasswordToken,
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: NewPasswordDto) {
    await this.usersService.trySetNewPasswordByToken(
      dto.resetPasswordToken,
      dto.password,
    );
  }

  @Get('confirm/:token')
  async confirmEmailConfirmationToken(@Param('token') token: string) {
    await this.usersService.tryVerifyEmailByToken(token);
  }
}

interface GoogleBody {
  googleToken: string;
}
