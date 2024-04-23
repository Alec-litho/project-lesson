import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostModel, PostDocument } from './entities/post-entity';
import { Image, ImageDocument } from '../image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageService } from '../image/image.service';
import { CreateImageDto } from '../image/dto/create-image.dto';
import isNotOutdated from 'utils/filterOldData';
import axios from 'axios';
const TAG_EXTRACTOR_KEY = "eyJvcmciOiI2NTNiOTllNjEzOGM3YzAwMDE2MDM5NTEiLCJpZCI6IjUxMzA4NjZkNjgzZjRiNjk5MTVlYzBkMzlhMjJlYzA3IiwiaCI6Im11cm11cjEyOCJ9";


@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel:Model<PostModel>,
        @InjectModel('Image') private readonly imageModel:Model<Image>,
        @InjectModel('User') private readonly userModel:Model<User>,
        @InjectModel('Comment') private readonly commentModel:Model<Comment>,
        private readonly imageService:ImageService
    ){}
    async createPost(dto:CreatePostDto) {
            const authorId:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(dto.author);
            let getKeyWords;
            try {
                getKeyWords = await axios.post('https://gw.cortical.io/nlp/keywords', {text:dto.text}, {headers: {'Content-Type': 'application/json', Authorization: TAG_EXTRACTOR_KEY}, params:{limit:15}});
            } catch (error) {
                console.log(error);
            }
            const postTags:string[] = getKeyWords? getKeyWords.data.keywords.map(obj => obj.word) : [];
            let post:PostDocument;
            if(dto.images.length!==0) {
                post = new this.postModel({text:dto.text, author: authorId, tags:postTags, images: dto.images.map((img:ImageDocument):mongoose.Types.ObjectId => new mongoose.Types.ObjectId(img._id))});
                //-----update loaded images to change postId field as we already got it-----
                dto.images.forEach(async (img:ImageDocument):Promise<void> => {await this.imageModel.findOneAndUpdate({_id:img._id}, {postId:post._id})})
            } else {
                post = new this.postModel({text:dto.text, author: authorId, tags:postTags, images:[]});
            }
            await post.save();
            return post.populate("images");
      
    }
    async getUserPosts(id:string, count:number) {
        const authorId = new mongoose.Types.ObjectId(id);
        const userPosts:PostDocument[] = await this.postModel.find({author: authorId}).sort({_id:-1})
        .populate([{//--------------------------i need to populate replies recursive until replies array in every comment is empty
            path: "comments",
            model: "Comment",
            select: "text user createdAt likes post replies replyTo",
            populate: [{
                path: "replies",
                model: "Comment",
                select: "text user createdAt likes post replies replyTo",
                populate: [{
                    path: "user",
                    model: "User",
                    select: "avatarUrl fullName gender"
                }]

            }, {
                path: "user",
                model: "User",
                select: "avatarUrl fullName gender"
            }]
        },{
            path: 'images',
            model: "Image"
        },
        {
            path: 'author',
            model: "User"
        }
    ])
        const postsByCount = userPosts.slice(count,count+10)
        if(!userPosts) return []
        return postsByCount
    }
    async getRecommendations(id:string, postsOnThePage: string[]) {
        const recommendationPosts = []
        const user = await this.userModel.findById(id);
        let userRecommendations = user.recommendations 
        //--------------------------friendsPosts--------------------------
        const friendsPosts = await Promise.all(user.friends.map(async(friend) => {
            const userPosts = await this.postModel.find({author:friend._id});
            const posts = userPosts.filter(post => {
                if(!post.likes.some(userLike => userLike===user._id) || postsOnThePage.indexOf(post.id)===-1) {/* || !post.views.some(userLike => userLike===user._id)*/ 
                    isNotOutdated(14, post)? true : false
                } else {
                    return false
                }
            })
            return posts.length > 5? posts.slice(0,5) : posts
        }));
        recommendationPosts.push(...friendsPosts)
        //--------------------------friends posts--------------------------

        //--------------------------friends liked posts--------------------------
        const friendsLikes = user.friends.map(async(friend) => {
            const posts = await this.postModel.find({likes:{$in:[friend._id]}})//get posts that your friend liked
            return posts.map((post, indx) => {//filter these post so user doesn't receive old posts
                if(indx === 2) return 
                if((!post.likes.some(userLike => userLike===user._id) || !post.views.some(userLike => userLike===user._id)) && isNotOutdated(14, post)) return post
            })
        })
        recommendationPosts.push(...friendsLikes)
        //--------------------------friends liked posts--------------------------

        //--------------------------posts by key words--------------------------

        getPostsByKeyWords//pushes posts to recommendationPosts

        function getPostsByKeyWords():void {
            const keyWordsTypes = [
                {keyWordsType:'frequentlyAppearingKeyWords', postsAmountByItsPriority:5},
                {keyWordsType:'newKeyWords', postsAmountByItsPriority:3},
                {keyWordsType:'oldKeyWords', postsAmountByItsPriority:2}
            ];
            keyWordsTypes.forEach(function({keyWordsType, postsAmountByItsPriority}) {requestPosts(keyWordsType, postsAmountByItsPriority)});
        }
        async function requestPosts(type: string, priorityNum: number):Promise<void> {
            console.log(this)
            const posts:PostModel[] = await this.postModel.find({tags:[...userRecommendations[type]]})//get all posts by key words type
            posts.filter((post:PostModel) => postsOnThePage.indexOf(post._id.toString())===-1)//filter posts that already on the page

            //i need to ignore postsAmountByItsPriority if posts of previouse type with specific priority posts num is less than it should be
            //for example - keyWordsType: frequentlyAppearingKeyWords, postsAmountByItsPriority: 5 ; result = 3 posts
            //so next keyWordsType should have postsAmountByItsPriority = postsAmountByItsPriority + postsAmountByItsPriority(prev type) - result num of prev num (5-3)

            posts.length>priorityNum? posts.slice(0,priorityNum) : posts
            recommendationPosts.push(...posts)
        }
        //--------------------------posts by key words--------------------------
 
        //--------------------------recently uploaded posts--------------------------
        let postsAmountToSkip = 0
        while(recommendationPosts.length < 15) {
            let postsAmountNeeded = 15-recommendationPosts.length;

            //JUST FOR A TEST BECAUSE I NEED TO PROPERLY POPULATE REPLIES-----------------
            const newPosts = await this.postModel.find().sort({ createdAt: -1 }).limit(postsAmountNeeded + postsAmountToSkip).skip(postsAmountToSkip).populate([{//--------------------------i need to populate replies recursive until replies array in every comment is empty
                path: "comments",
                model: "Comment",
                select: "text user createdAt likes post replies replyTo",
                populate: [{
                    path: "replies",
                    model: "Comment",
                    select: "text user createdAt likes post replies replyTo",
                    populate: [{
                        path: "user",
                        model: "User",
                        select: "avatarUrl fullName gender"
                    }]
    
                }, {
                    path: "user",
                    model: "User",
                    select: "avatarUrl fullName gender"
                }]
            },{
                path: 'images',
                model: "Image"
            },
            {
                path: 'author',
                model: "User"
            }
        ]);
        //JUST FOR A TEST BECAUSE I NEED TO PROPERLY POPULATE REPLIES-----------------
            postsAmountToSkip += postsAmountNeeded;
            console.log('recently posts',newPosts.map(post => post._id),postsAmountNeeded, postsAmountToSkip);
            newPosts.filter((post) => postsOnThePage.indexOf(post._id.toString())===-1);
            recommendationPosts.push(...newPosts);
        }
        //--------------------------recently uploaded posts--------------------------
        console.log(recommendationPosts.map(post => post._id), recommendationPosts.length)
        return recommendationPosts
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
            this.commentModel.deleteMany({post: isDeleted._id})
            if(!isDeleted) throw new NotFoundException({message:"Post wasn't deleted successfully, probably provided id is invalid"});
            return isDeleted._id;

        } catch (error) {
            return new InternalServerErrorException({message:error})
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
            const userId = new mongoose.Types.ObjectId(id)
            const updatedPost = await this.postModel.findByIdAndUpdate(id, {$push: {views:userId}});
            console.log(id, updatedPost);
            
            if(!updatedPost) throw new NotFoundException({message:"Post wasn't updated successfully, probably provided id is invalid"});
            return updatedPost._id
        } catch (error) {
            throw new InternalServerErrorException({message:error})
        }
    };
    async likePost(id:string, userId:string) {
        console.log("likepost",id, userId);
        
        const userMongoId = new mongoose.Types.ObjectId(userId)
        const postId = new mongoose.Types.ObjectId(id)
        const user = await this.userModel.findById(userMongoId);
        const post = await this.postModel.findById(postId);
        const recomm:any = {} 
        let oldWords:string[] = user.recommendations.oldKeyWords
        
        if(oldWords.length===0) {
            const newKeyWords = user.recommendations.newKeyWords//shorter name
            
            if(newKeyWords.length===0) {
                user.recommendations.newKeyWords =  post.tags
            }else {
                post.tags.forEach(tag => {
                    const indx = newKeyWords.indexOf(tag);
                    if(indx===-1){
                        user.recommendations.newKeyWords = [...newKeyWords,tag] 
                    } else {
                        user.recommendations.newKeyWords.splice(indx,1)//remove old word from newKeyWords category
                        user.recommendations.oldKeyWords = [...user.recommendations.oldKeyWords,newKeyWords[indx]]
                    }
                })
            }

        } else {
            Object.assign(recomm,user.recommendations)
            console.log(Object.values(recomm._doc));//[ [], [], [], new ObjectId('659ac33ce183c984ff3a2c9e') ]
            Object.values(recomm._doc).slice(0,3).forEach((category:[]) => oldWords = [...oldWords, ...category]);//{frequentlyAppearingKeyWords:[dogs,cats], newKeyWords:[politics], oldKeyWords:[food]} => [dogs,cats,politics,food]
            console.log(oldWords);
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
        user.age = user.age//somehow its giving me error if i don't set same age as it was before
        user.save()
        const oldLikesArr = [...post.likes]
        post.likes = [...oldLikesArr, userMongoId]
        post.save()
        return post? true : false;
    }
    async removeLike(id:string, userId:string) {
        const postId = new mongoose.Types.ObjectId(id);
        const userIdMongoose = new mongoose.Types.ObjectId(userId);
        const post = await this.postModel.findByIdAndUpdate(postId, {likes:{$pull:userIdMongoose}})
        return post? true : false
    }
    async removeRecommendations(id:string, userId:string) {
        const postId = new mongoose.Types.ObjectId(id);
        const userIdMongoose = new mongoose.Types.ObjectId(userId);
        const updatedPost = await this.postModel.findByIdAndUpdate(postId,{removedRecommendation:{$push:userIdMongoose}})
        return updatedPost? true : false
    }
}

