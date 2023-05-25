import { IsNotEmpty } from "class-validator";

export class NewPasswordDto {

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    resetPasswordToken: string;
  }