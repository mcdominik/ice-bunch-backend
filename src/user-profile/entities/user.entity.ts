import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  username: string;
  
  @Prop()
  passwordHash: string;

  @Prop()
  emailConfirmed: boolean;

  @Prop()
  accountType: AccountType; 
  
  @Prop()
  avatarUrl: string;

  @Prop()
  emailConfirmationToken?: string;

  @Prop()
  resetPasswordToken?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

export enum AccountType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}
