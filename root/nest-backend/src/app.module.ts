import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './image/image.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AlbumModule } from './album/album.module';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://opaltaco:eamV2B1PXGjNFX3y@cluster0.iyapupi.mongodb.net/blog?retryWrites=true&w=majority'),
    ImageModule,
    UserModule,
    AlbumModule,
    RolesModule,
    PostModule,
    CommentModule,
    NotificationModule
  ],
  controllers: [AppController, RolesController],
  providers: [AppService, RolesService],
})
export class AppModule {}
