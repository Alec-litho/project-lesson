let {PostModel} = require('../models/post')
let {ImageModel} = require('../models/image')
let {CommentModel} = require('../models/comment')
let {ObjectID} = require('mongodb')
let getAll = async(req,res) => {
    try {
        let posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) { 
        console.log(error);
        res.status(500).json({message:'Could not get posts'})
    }
}
let getMyPosts = async function(req, res) {
    let posts = await PostModel.find({user: req.body.id}).populate("images").populate("comments")
    res.send(posts)
}  
let getPostImages = async function(req, res) {
    let imgId = new ObjectID(`${req.body.imgId}`)  
    let postImages = await PostModel.find({images: imgId}, {images: 1}).populate("images")
    res.send(postImages)
}  
let getOne = async(req,res) => {
    try {
        const postId = req.params['id']
        PostModel.findOneAndUpdate(
        {_id: postId},
        {$inc: {viewsCount: 1}},
        {returnDocument: 'after'},
        ).then(doc => {
                res.json(doc)
            }
        ).catch(err => console.log(err))
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Could not get posts'})
    }
}
let deletePost = (req,res) => {
        let postId = new ObjectID(`${req.params['id']}`) 
        console.log(postId);
        PostModel.findOneAndDelete({"_id": postId})
          .then(doc => res.send(doc))
}
let update = async(req,res) => {
    try {
        const postId = req.params['id']
        await PostModel.updateOne({_id: postId},
            {   
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        )
    } catch (error) {
        
    }
}

let create = async(req,res) => {
    try { 
        let imgs = req.body.imageUrl.map(img => {
            return new ObjectID(`${img}`)  
        })
        const doc = new PostModel({
            text: req.body.text,
            images: imgs,
            tags: req.body.tags,
            user: req.body.id
        })
        const post = await doc.save()
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Could not upload post'})
    }
} 
let getComments = function(req, res) {
    const postId = new ObjectID(`${req.params.id}`)  
    CommentModel.findOne({"_id": postId}).populate("replies").then(resp => res.send(resp))
}
let postComment = async(req, res) => {
    const postId = new ObjectID(`${req.params.id}`)  
    const doc = new CommentModel({
        text: req.body.text,
        user: req.body.id,
        autherPicture: req.body.autherPicture,
        autherName: req.body.autherName,
        post: postId,
        likes: [],
        replies: []
    })
    let response = await PostModel.findOneAndUpdate({"_id":postId}, {$push: {comments: doc}}, { upsert: true }).exec()
    console.log(response);
    let resp = await doc.save()
    res.send(resp)
}
let postSmashLike = function(req,res) {
    const userId = new ObjectID(`${req.body.userId}`)
    const postId = new ObjectID(`${req.body.postId}`)
    let doc = PostModel.find({"_id":'wddf'}).then(res => {
        console.log(res);
        // console.log(res[0].likes);
        // let acces = true
        // res[0].likes.forEach(user => {if(user === userId) acces = false})
        // if(acces) res[0].likes.push(userId)
        // res.save()
    })
    res.send('good')
}
let postReply = async(req, res) => {
    const id = new ObjectID(`${req.params.id}`)  
    const resp = await CommentModel.updateOne({"_id":id}, { $push: { replies: req.body.reply } })
    res.send(resp)
}
let deleteComment = async(req, res) => {
    const id = new ObjectID(`${req.params.id}`)  
    const resp = await CommentModel.deleteOne({"_id":id})
    res.send(resp)
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
    postSmashLike
}