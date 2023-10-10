const {PostModel} = require("../models/post");
const {imageModel} = require("../models/image");
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
    const posts = await PostModel.find({user: req.body.id}).populate("images").populate({
        path: 'comments',
        populate: {path:"replies"}
    });
    console.log(posts, 'w');
    // [...posts.comments].map((comment) => comment.populate())

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
const deletePost = async(req,res) => {
        let doc = await PostModel.findById(req.params["id"])
        doc.images.forEach(async(image) => {
            await imageModel.findByIdAndDelete(image);
        })
        let result = await PostModel.findOneAndDelete({"_id": req.params["id"]})
        res.json(result)
};
const update = async(req,res) => {
    try {
        await PostModel.updateOne({_id: req.params["id"]},
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
        const doc = new PostModel({
            text: req.body.text? req.body.text : '',
            images: req.body.imageUrl,
            tags: req.body.tags,
            user: req.body.id
        });
        await doc.save();
        let post = await PostModel.findById(doc._id).populate('images')
        let updateImgs = await PostModel.findById(doc._id).populate('images')
        updateImgs.images.forEach(async(image) => {
            const res = await imageModel.findOneAndUpdate({_id:image._id}, {$set:{postId: doc._id.toString()}},{new:true});
            res.save();
        })
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
        post: req.params.id,
        repliedCommentId:'false',
        replyTo: 'false',
        likes: [],
        replies: []
    });
    await doc.save();
    console.log(req.params.id);
    await PostModel.findOneAndUpdate({"_id":req.params.id}, {$push: {comments: doc}}, { upsert: true }).exec();
    const post = await PostModel.findById(req.params.id).populate('comments').populate('images');
    res.send(post);
    } catch(err) {
        console.log(err);
    }
    
};
const postSmashLike = async function(req,res) {
    const userId = new ObjectId(`${req.body.userId}`);
    const postId = new ObjectId(`${req.body.postId}`);
    // const doc = await PostModel.findOne({"likes":[userId]});
    let doc = await PostModel.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, { upsert: true }).exec();
    console.log(doc);
    res.send(doc);
};

const postRemoveLike = async function(req,res) {
    // const userId = new ObjectId(`${req.body.userId}`);
    // const postId = new ObjectId(`${req.body.postId}`);
    
    let userId = req.body.userId
    const doc = await PostModel.findByIdAndUpdate(req.body.postId, {$pull: {likes: userId}}, { upsert: true }).exec();
    console.log(doc);
    res.send(doc);
};
const postReply = async(req, res) => {
    try {
        const reply = new CommentModel({
            text: req.body.text,
            user: req.body.user,
            authorPicture: req.body.authorPicture,
            authorName: req.body.authorName,
            post: req.params.id,
            repliedCommentId:req.params.commentId,
            replyTo: req.body.replyTo,
            likes: [],
            replies: []
        })
        reply.save()
        const resp = await CommentModel.findByIdAndUpdate(req.params.id, { $push: { replies: reply } });
        resp.save();
        res.send(resp);
    } catch (error) {
        console.log(error);
    }
};
const deleteComment = async(req, res) => {
    // const id = new ObjectId(`${req.params.id}`);  
    const resp = await CommentModel.findByIdAndDelete(req.params.id);
    res.send(resp);
};
const postWatched = async(req, res) => {
    try {
        let updatedPost = await PostModel.findByIdAndUpdate(req.body.postId, {$inc: {viewsCount:1}})
        updatedPost.save(req.body.postId, updatedPost)
    } catch (error) {
        console.log(error);
    }

}


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
    postRemoveLike,
    postWatched
};