import { IsString, MaxLength } from "class-validator";

export class ChangeUsernameDto {

    @IsString()
    userId: string;
  
    @MaxLength(20)
    @IsString()
    newUsername: string;
  
  }