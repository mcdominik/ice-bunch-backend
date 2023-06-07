import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailsModule } from './mails/mails.module';
import { ReviewsModule } from './reviews/reviews.module';
import { IceCreamsModule } from './ice-creams/ice-creams.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule]
})
export class AppModule {
  static forRoot(options?: {
    mongoHost?: string;
    mongoPassword?: string;
  }): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
          `mongodb+srv://admin:${
            options?.mongoPassword ?? process.env.MONGO_PASSWORD
          }@${options?.mongoHost ?? process.env.MONGO_HOST}/admin`,
          { dbName: 'icebunch' },
        ),
        AuthModule,
        CloudinaryModule,
        UsersModule,
        MailsModule,
        IceCreamsModule,
        ReviewsModule
      ],
    };
  }
}
