import { IsEmail, IsString } from 'class-validator';
import { AccountType } from '../entities/user.entity';

export class CreateUserDtoFromFrontend {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  accountType: AccountType;

}

export class CreateUserDto {
  email: string;
  passwordHash: string;
  emailConfirmed: boolean;
  accountType: AccountType;
  emailConfirmationToken?: string;
}
