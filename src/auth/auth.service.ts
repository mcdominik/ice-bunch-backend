import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import { AccountType, User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GoogleResponse } from './models/GoogleModels';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getOneByEmail(email);

    if (user && (await compare(password, user.passwordHash))) {
      return { id: user._id, email: user.email };
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user._id, email: user.email };

    return {
      email: user.email,
      token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleToken: string) {
    const response: GoogleResponse = await firstValueFrom(
      this.httpService.post(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${googleToken}`,
      ),
    );
    const email = response.data.email;

    let user = await this.usersService.getOneByEmail(email);

    if (!user) {
      await this.usersService.createVerifiedByOauthProvider({ email, password: '', accountType: AccountType.GOOGLE });
      user = await this.usersService.getOneByEmail(email);
    }

    const payload = { email: user.email, sub: user._id };

    return {
      email: email,
      token: this.jwtService.sign(payload),
    };
  }
}
