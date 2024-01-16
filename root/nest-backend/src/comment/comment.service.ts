import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostModel } from 'src/post/entities/post-entity';
import { UpdateCommentDto } from './dto/update-comment.dto';



@Injectable()
export class CommentService {
    constructor(
        @InjectModel("Comment") private readonly commentModel:Model<Comment>,
        @InjectModel("Post") private readonly postModel: Model<PostModel>
    ){}

    public async uploadComment(dto:CreateCommentDto) {
            const userId:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(dto.user);
            const postId:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(dto.post);
            let comment;
            if(dto.replyTo) {
                comment = new this.commentModel({text:dto.text, user:userId, post:postId, replyTo:new mongoose.Types.ObjectId(dto.replyTo.toString())});
            } else {
                comment = new this.commentModel({text:dto.text, user:userId, post:postId, replyTo:false});
            }
            if(!comment) throw new HttpException("something went wrong while creating comment", HttpStatus.BAD_REQUEST);
            comment.save()
            const post = await this.postModel.findByIdAndUpdate(new mongoose.Types.ObjectId(dto.post), {$push: {comments: comment._id}}, { upsert: true });
            if(!post) throw new HttpException("something went wrong while pushing comment to the post", HttpStatus.BAD_REQUEST);
            return comment
    }
    public async updateComment(dto: UpdateCommentDto) { 
        try {
            const commentId = new mongoose.Types.ObjectId(dto._id)
            if(!this.commentModel.findById(dto._id)) return new NotFoundException(dto, "provided _id is invalid")
            return await this.commentModel.findByIdAndUpdate(commentId, {...dto, commentId});
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
    public async likeComment(commentId:string, userId:string) {
        try {
            
            const authorIdMongoose = new mongoose.Types.ObjectId(userId);
            const comment = await this.commentModel.findByIdAndUpdate(commentId, {
                $push: {likes: authorIdMongoose}
            })
            console.log(commentId,userId,comment);
            if(!comment) throw new HttpException("something went wrong with liking the comment", HttpStatus.BAD_REQUEST);
            return true;

        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
    public async removeLike(commentId:string, userId:string) {
        try {
            console.log(commentId,userId);
            
            const authorIdMongoose = new mongoose.Types.ObjectId(userId);
            const comment = await this.commentModel.findByIdAndUpdate(commentId, {
                $pull: {likes: authorIdMongoose}
            })
            if(!comment) throw new HttpException("the like was already removed", HttpStatus.BAD_REQUEST);
            return true;

        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
    public async uploadReply(id:string, dto: CreateCommentDto) { 
        try {
            const commentId = new mongoose.Types.ObjectId(id); 
            const comment = new this.commentModel(dto);
            if(!comment) throw new HttpException("something went wrong while creating comment", HttpStatus.BAD_REQUEST);
            comment.save()
            const response = await this.commentModel.findByIdAndUpdate(commentId, {
                $push:{replies: comment._id}
            })
            console.log(response,commentId, id);
            
            if(!response) throw new HttpException("something went wrong while pushing reply to the comment", HttpStatus.BAD_REQUEST);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    public async deleteComment(id:string) {
        try {
            const commentId = new mongoose.Types.ObjectId(id)
            if(!this.commentModel.findById(commentId)) throw new NotFoundException(commentId, "comment with such id doesn't exist");
            const deletedComment = await this.commentModel.findByIdAndDelete(commentId);
            if(!deletedComment) throw new HttpException("something went wrong while deleting comment", HttpStatus.BAD_REQUEST);
            return true
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

}
