import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './entities/post-entity';
import { ImageSchema } from '../image/entities/image.entity';
import { ImageModule } from '../image/image.module';
import { UserSchema } from 'src/user/entities/user.entity';


@Module({
  imports: [
    ImageModule,
    MongooseModule.forFeature([{name:"Post", schema:PostSchema}]),
    MongooseModule.forFeature([{name:"User", schema:UserSchema}]),
    MongooseModule.forFeature([{name:"Image", schema:ImageSchema}])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostModule, MongooseModule]
})
export class PostModule {}
