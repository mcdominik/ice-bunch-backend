import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../entities/user.entity';

export class CreateUserDtoFromFrontend {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  username: string;

  accountType: AccountType;

}

export class CreateUserDto {
  email: string;
  avatarUrl: string;
  username: string;
  passwordHash: string;
  emailConfirmed: boolean;
  accountType: AccountType;
  emailConfirmationToken?: string;
}
