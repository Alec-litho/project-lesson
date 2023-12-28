import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostModel, PostDocument } from './entities/post-entity';
import { Image, ImageDocument } from '../image/entities/image.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageService } from '../image/image.service';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { UpdateImageDto } from '../image/dto/update-image.dto';
import { DeleteImageDto } from '../image/dto/delete-image.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel:Model<PostModel>,
        @InjectModel('Image') private readonly imageModel:Model<Image>,
        private readonly imageService:ImageService
    ){}
    async createPost(dto:CreatePostDto) {
            const authorId:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(dto.author);
            async function createPostModel(postData:any/*think about it*/):Promise<PostDocument> {
                if(postData.images.length!==0) {
                    const images:mongoose.Types.ObjectId[] = postData.images.map((img:ImageDocument):mongoose.Types.ObjectId => img._id)
                    postData.images = images
                }
                const post:PostDocument = new this.postModel(postData);
                await post.save()
                return post;
            }
            if(dto.images.length!==0) {
                //------------------load post's images------------------
                const images:Image[] = await Promise.all(dto.images.map(async(img:any/*it will always be CreateImageDto type*/):Promise<Image> => {
                    return await this.imageService.uploadImage(img);
                }))
                //------------------load post itself------------------
                const post:PostDocument = await createPostModel.call(this,{...dto, author: authorId, images})
                //-----update loaded images to change postId field as we already got it-----
                images.forEach(async (img:ImageDocument):Promise<void> => {await this.imageModel.findOneAndUpdate({_id:img._id}, {postId:post._id})})
                return post;
            } else {
                return await createPostModel.call(this,{...dto, author: authorId});
            }
      
    }
    async getUserPosts(id: string) {
        const authorId = new mongoose.Types.ObjectId(id);
        const userImages:PostDocument[] = await this.postModel.find({author: authorId})
        // .populate("images")
        // .populate({
        //     path: 'comments',
        //     populate: {path:"replies"}
        // });
        console.log(userImages,id);
        
        if(!userImages) return []
        return userImages
    }
    async getOnePost(id:string) {
        try {
            const post = await this.postModel.findById(id);
            if(!post) throw new NotFoundException()
            return post
        } catch (error) {
            throw new InternalServerErrorException({message:error})
        }
    }
    async deletePost(id:string) {
        try {
            const isDeleted = await this.postModel.findByIdAndDelete(id).populate("images");
            if(isDeleted.images.length!==0) {
                isDeleted.images.forEach(async(img:ImageDocument) => {
                    await this.imageModel.findByIdAndDelete(img._id)
                })
            }
            if(!isDeleted) throw new NotFoundException({message:"Post wasn't deleted successfully, probably provided id is invalid"});
            return isDeleted._id;

        } catch (error) {
            throw new InternalServerErrorException({message:error})
        }
    }
    async updatePost(id:string, dto:UpdatePostDto) {
        try {
            const postId = new mongoose.Types.ObjectId(id); 
            const post = await this.postModel.findById(postId);
            console.log(post,dto);
            
            if(!post) throw new NotFoundException({message:"Post wasn't updated successfully, probably provided id is invalid"});

            if(dto.images.length!==0) {
            const oldPostImgs = await this.imageModel.find({postId});
            console.log(oldPostImgs);
            const images = dto.images.map(postImg => new mongoose.Types.ObjectId(postImg._id))
            oldPostImgs.forEach(async(img) => {//remove old images from db and from post itself

                let strImages = images.map(img => img.toString())
                console.log("foreach",strImages, img._id.toString(), images.indexOf(img._id));
                if(strImages.indexOf(img._id.toString()) === -1) {
                    const delImg = await this.imageModel.findByIdAndDelete(img._id);
                    console.log("del",delImg);
                    
                }
            })
            return await this.postModel.findByIdAndUpdate(postId, {...dto,images});
           }
           return await this.postModel.findByIdAndUpdate(postId, dto);
        } catch (error) {
            throw new InternalServerErrorException({message:error});
        }
        

    }
    async postWatched(id:string) {
        try {
            const updatedPost = await this.postModel.findByIdAndUpdate(id, {$inc: {viewsCount:1}});
            if(!updatedPost) throw new NotFoundException({message:"Post wasn't updated successfully, probably provided id is invalid"});
            return updatedPost._id
        } catch (error) {
            throw new InternalServerErrorException({message:error})
        }
    }
}
