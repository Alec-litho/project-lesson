import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Comment", schema:CommentSchema}]),
    PostModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentModule, CommentService]
})
export class CommentModule {}
