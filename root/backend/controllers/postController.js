const {PostModel} = require("../models/post");
const {ImageModel} = require("../models/image");
const {CommentModel} = require("../models/comment");
const {ObjectId} = require("mongodb");
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
    const posts = await PostModel.find({user: req.body.id}).populate("comments");
    console.log(posts);
    res.send(posts);
};  
const getPostImages = async function(req, res) {
    console.log();
    const postImages = await PostModel.find({images: req.body.imgId}, {images: 1}).populate("images");
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
        const postId = new ObjectId(`${req.params["id"]}`); 
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
        // const imgs = req.body.imageUrl.map(img => {
        //     return new ObjectId(`${img}`);  
        // });
        const doc = new PostModel({
            text: req.body.text? req.body.text : '',
            images: req.body.imageUrl,
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
    CommentModel.findOne({"_id": req.params.id}).populate("replies").then(resp => res.send(resp));
};
const postComment = async(req, res) => {
    try{
        console.log("body --> ",req.body);
    const doc = new CommentModel({
        text: req.body.text,
        user: req.body.user,
        authorPicture: req.body.authorPicture,
        authorName: req.body.authorName,
        post: req.params.postId,
        likes: [],
        replies: []
    });
    const resp = await doc.save();
    const response = await PostModel.findOneAndUpdate({"_id":req.params.id}, {$push: {comments: doc}}, { upsert: true }).exec();
    console.log('response --> ',response);
    res.send(resp);
    } catch(err) {
        console.log(err);
    }
    
};
const postSmashLike = async function(req,res) {
    const userId = new ObjectId(`${req.body.userId}`);
    const postId = new ObjectId(`${req.body.postId}`);
    const doc = await PostModel.findOne({"likes":[userId]});
    if(doc === null) {
        PostModel.findOneAndUpdate({"_id":[postId]}, {$push: {likes: userId}}, { upsert: true }).exec();
    } else {
        console.log("already smashed like");
    }
    res.send(doc);
};

const postRemoveLike = async function(req,res) {
    const userId = new ObjectId(`${req.body.userId}`);
    const postId = new ObjectId(`${req.body.postId}`);
    const doc = await PostModel.findOneAndUpdate({"_id":[postId]}, {$pull: {likes: userId}}, { upsert: true }).exec();
    res.send(doc);
};
const postReply = async(req, res) => {
    const id = new ObjectId(`${req.params.id}`);  
    const resp = await CommentModel.updateOne({"_id":id}, { $push: { replies: req.body.reply } });
    res.send(resp);
};
const deleteComment = async(req, res) => {
    const id = new ObjectId(`${req.params.id}`);  
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