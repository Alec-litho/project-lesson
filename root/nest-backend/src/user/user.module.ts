import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AlbumModule } from 'src/album/album.module';
import { Album, AlbumSchema } from '../album/entities/album.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Album", schema: AlbumSchema }]),
    JwtModule.register({
      global: true,
      secret: "secret",
      "signOptions": {expiresIn:'1000000s'}
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserModule,
    UserService, //forwardRef(() => UserService) - to prevent circular dependency
    JwtModule 
  ]
})
export class UserModule {}
