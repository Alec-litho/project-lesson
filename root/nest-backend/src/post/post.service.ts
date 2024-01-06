import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostModel, PostDocument } from './entities/post-entity';
import { Image, ImageDocument } from '../image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageService } from '../image/image.service';
import { CreateImageDto } from '../image/dto/create-image.dto';
import filterOldData from 'utils/filterOldData';
import axios from 'axios';
const TAG_EXTRACTOR_KEY = "eyJvcmciOiI2NTNiOTllNjEzOGM3YzAwMDE2MDM5NTEiLCJpZCI6IjUxMzA4NjZkNjgzZjRiNjk5MTVlYzBkMzlhMjJlYzA3IiwiaCI6Im11cm11cjEyOCJ9";


@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel:Model<PostModel>,
        @InjectModel('Image') private readonly imageModel:Model<Image>,
        @InjectModel('User') private readonly userModel:Model<User>,
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
            const getKeyWords = await axios.post('https://gw.cortical.io/nlp/keywords', {text:dto.text}, {headers: {'Content-Type': 'application/json', Authorization: TAG_EXTRACTOR_KEY}, params:{limit:15}});
            const postTags = getKeyWords.data.keywords.map(obj => obj.word);
            if(dto.images.length!==0) {
                //------------------load post's images------------------
                const images:Image[] = await Promise.all(dto.images.map(async(img:any/*it will always be CreateImageDto type*/):Promise<Image> => {
                    return await this.imageService.uploadImage(img);
                }))
                //------------------load post itself------------------
                const post:PostDocument = await createPostModel.call(this,{...dto, author: authorId, images, tags:postTags})
                //-----update loaded images to change postId field as we already got it-----
                images.forEach(async (img:ImageDocument):Promise<void> => {await this.imageModel.findOneAndUpdate({_id:img._id}, {postId:post._id})})
                return post;
            } else {
                return await createPostModel.call(this,{...dto, author: authorId,tags:postTags});
            }
      
    }
    async getUserPosts(id: string) {
        const authorId = new mongoose.Types.ObjectId(id);
        const userImages:PostDocument[] = await this.postModel.find({author: authorId}) //нихуя не полкчается популейтит 
        // const posts = await Promise.all(userImages.map(async(post) => {
        //     const postImages:Image[] = await Promise.all(post.images.map(async(imageId) => await this.imageModel.findOne(imageId)));
        //     post.images = postImages;
        //     console.log(post);
            
        //     return post;
        // }))
        //.populate("images")
        // .populate({
        //     path: 'comments',
        //     populate: {path:"replies"}
        // });

        
        if(!userImages) return []
        return userImages
    }
    async getUserRecommendations(id:string) {
        //1 - Friends posts (friendsPosts)
        //2 - Posts that user's friends like (friendsLikes)
        //3 - Posts by keywords (keywordsPosts)
        //4 - Posts that was created recently
        const user = await this.userModel.findById(id);
        let userRecommendations:string[] = []
        Object.values(user.recommendations).forEach(category => userRecommendations = [...userRecommendations, ...category]);//{frequentlyAppearingKeyWords:[dogs,cats], newKeyWords:[politics], oldKeyWords:[food]} => [dogs,cats,politics,food]
        const friendsPosts = await Promise.all(user.friends.map(async(friend) => {
            const userPosts = await this.postModel.find({author:friend._id});
            const posts = userPosts.filter(post => {
                if(!post.likes.some(user => user===user._id) || !post.viewCount.some(user => user===user._id)) {//if post was liked by user or user already have seen this post don't return it
                    filterOldData(14, post)? true : false
                } else {
                    return false
                }
            })
            console.log(posts);
            return posts
        }));
        const friendsLikes = []
        user.friends.forEach(async(friend) => {
            const posts = await this.postModel.find({likes:{$in:[friend._id]}})//get posts that your friend liked
            posts.map(post => {//filter these post so user doesn't receive old posts
                if((!post.likes.some(user => user===user._id) || !post.viewCount.some(user => user===user._id)) && filterOldData(14, post)) friendsLikes.push(post)
            })
        })
        const posts = [];
        for (let i = 1; posts.length <= 15; i++) {
            // await this.postModel.find().sort({ createdAt: -1 }).limit(20*i)  // 10 latest docs
            
            //get latest documents while posts length is under 15
            //after getting 20 documents, sort them by these parameters: userKeywords (popular,new,old), if user already saw that post dont return
            //after sorting push these documents to posts
            //if posts is under 15 repeat
        }


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
    };
    async postWatched(id:string) {
        try {
            const updatedPost = await this.postModel.findByIdAndUpdate(id, {$inc: {viewsCount:1}});
            if(!updatedPost) throw new NotFoundException({message:"Post wasn't updated successfully, probably provided id is invalid"});
            return updatedPost._id
        } catch (error) {
            throw new InternalServerErrorException({message:error})
        }
    };
    async likePost(id:string, userId:string) {
        console.log(id, userId);
        
        const userMongoId = new mongoose.Types.ObjectId(userId)
        const postId = new mongoose.Types.ObjectId(id)
        const user = await this.userModel.findById(userMongoId);
        const post = await this.postModel.findById(postId);
        let oldWords:string[] = []
        Object.values(user.recommendations).forEach(category => oldWords = [...oldWords, ...category]);//{frequentlyAppearingKeyWords:[dogs,cats], newKeyWords:[politics], oldKeyWords:[food]} => [dogs,cats,politics,food]
        if(oldWords.length===0) {
            oldWords = post.tags;
        } else {
            const postTags = post.tags;
            const frequentlyAppearingWords = []
            const newWords = []
            for (let i = 0; i < postTags.length; i++) {
                let indx = oldWords.indexOf(postTags[i])
                if(indx!==-1) {
                    frequentlyAppearingWords.push(postTags[i]); 
                    oldWords.splice(indx,1)
                } else {
                    newWords.push(postTags[i])
                }
                console.log(indx,oldWords);
              }
              if(oldWords.length>60) {
                const oldRecommendations = oldWords.slice(0,60)
                user.recommendations = {frequentlyAppearingKeyWords:frequentlyAppearingWords, newKeyWords:newWords, oldKeyWords:oldRecommendations}
              } else {
                user.recommendations = {frequentlyAppearingKeyWords:frequentlyAppearingWords, newKeyWords:newWords, oldKeyWords:oldWords}
              }
        
        }
        user.age = user.age//somehow its giving me error if i dont set same age as it was before
        user.save()
        post.likes = [...post.likes, userMongoId];
        post.save()
        return post? true : false;
    }
}
