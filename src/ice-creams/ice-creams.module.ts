import { Module } from '@nestjs/common';
import { IceCreamsService } from './ice-creams.service';
import { IceCreamsController } from './ice-creams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IceCreamSchema, IceCream } from './entities/ice-cream.entity';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IceCream.name, schema: IceCreamSchema },
    ]),
    UsersModule,
    CacheModule.register(),
  ],
  controllers: [IceCreamsController],
  providers: [IceCreamsService],
  exports: [IceCreamsService],
})
export class IceCreamsModule {}
