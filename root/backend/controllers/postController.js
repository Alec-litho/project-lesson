const {PostModel} = require("../models/post");
const {ImageModel} = require("../models/image");
const {CommentModel} = require("../models/comment");
const {ObjectID} = require("mongodb");
const getAll = async(req,res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();

        res.json(posts);
    } catch (error) { 
        console.log(error);
        res.status(500).json({message:"Could not get posts"});
    }
};
const getMyPosts = async function(req, res) {
    const posts = await PostModel.find({user: req.body.id}).populate("images").populate("comments");
    res.send(posts);
};  
const getPostImages = async function(req, res) {
    const imgId = new ObjectID(`${req.body.imgId}`);  
    const postImages = await PostModel.find({images: imgId}, {images: 1}).populate("images");
    res.send(postImages);
};  
const getOne = async(req,res) => {
    try {
        const postId = req.params["id"];
        PostModel.findOneAndUpdate(
        {_id: postId},
        {$inc: {viewsCount: 1}},
        {returnDocument: "after"},
        ).then(doc => {
                res.json(doc);
            }
        ).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Could not get posts"});
    }
};
const deletePost = (req,res) => {
        const postId = new ObjectID(`${req.params["id"]}`); 
        console.log(postId);
        PostModel.findOneAndDelete({"_id": postId})
          .then(doc => res.send(doc));
};
const update = async(req,res) => {
    try {
        const postId = req.params["id"];
        await PostModel.updateOne({_id: postId},
            {   
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        );
    } catch (error) {
        
    }
};

const create = async(req,res) => {
    try { 
        const imgs = req.body.imageUrl.map(img => {
            return new ObjectID(`${img}`);  
        });
        const doc = new PostModel({
            text: req.body.text,
            images: imgs,
            tags: req.body.tags,
            user: req.body.id
        });
        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Could not upload post"});
    }
}; 
const getComments = function(req, res) {
    const postId = new ObjectID(`${req.params.id}`);  
    CommentModel.findOne({"_id": postId}).populate("replies").then(resp => res.send(resp));
};
const postComment = async(req, res) => {
    const postId = new ObjectID(`${req.params.id}`);  
    const doc = new CommentModel({
        text: req.body.text,
        user: req.body.id,
        autherPicture: req.body.autherPicture,
        autherName: req.body.autherName,
        post: postId,
        likes: [],
        replies: []
    });
    const response = await PostModel.findOneAndUpdate({"_id":postId}, {$push: {comments: doc}}, { upsert: true }).exec();
    console.log(response);
    const resp = await doc.save();
    res.send(resp);
};
const postSmashLike = async function(req,res) {
    const userId = new ObjectID(`${req.body.userId}`);
    const postId = new ObjectID(`${req.body.postId}`);
    const doc = await PostModel.findOne({"likes":[userId]});
    if(doc === null) {
        PostModel.findOneAndUpdate({"_id":[postId]}, {$push: {likes: userId}}, { upsert: true }).exec();
    } else {
        console.log("already smashed like");
    }
    res.send(doc);
};

const postRemoveLike = async function(req,res) {
    const userId = new ObjectID(`${req.body.userId}`);
    const postId = new ObjectID(`${req.body.postId}`);
    const doc = await PostModel.findOneAndUpdate({"_id":[postId]}, {$pull: {likes: userId}}, { upsert: true }).exec();
    res.send(doc);
};
const postReply = async(req, res) => {
    const id = new ObjectID(`${req.params.id}`);  
    const resp = await CommentModel.updateOne({"_id":id}, { $push: { replies: req.body.reply } });
    res.send(resp);
};
const deleteComment = async(req, res) => {
    const id = new ObjectID(`${req.params.id}`);  
    const resp = await CommentModel.deleteOne({"_id":id});
    res.send(resp);
};

module.exports = {
    create,
    getAll,
    getOne,
    deletePost,
    update,
    getMyPosts,
    getPostImages,
    getComments,
    postComment,
    postReply,
    deleteComment,
    postSmashLike,
    postRemoveLike
};