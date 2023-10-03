const {imageModel} = require("../models/image");
const {AlbumModel} = require("../models/album");
const {ObjectId} = require("mongodb");
const { isRouteErrorResponse } = require("react-router-dom");
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find();
    res.send(images);
};

module.exports.uploadImage = async function(req,res) {
    try {
        const album = req.body.album !== undefined? await AlbumModel.findById(req.body.albumId) : undefined;
        const doc = new imageModel({ 
            title: req.body.title,
            imageURL: req.body.imageURL,
            description: req.body.description,
            user: req.userId,
            album: req.body.albumId,
            postId: req.body.postId
        });

        if(album) {
            await doc.save();
            album.images.push(doc);
            await album.save();
            res.json(album);
        } else {
            doc.save();
            res.json(doc);
        } 
    } catch(err) {
        console.log(err);
    }
   

};

module.exports.updateImage = function(req,res) {
    // imageModel.findByIdAndUpdate(req.params.id, {post: true}).then(resp => res.send(resp));
};
module.exports.getOneImage = function(req,res) {
    imageModel.findById(req.params.id).then(resp => res.send(resp));
};
module.exports.deleteImage = (req,res) => {
    imageModel.findByIdAndDelete(req.params.id).then(resp => res.send(resp));
};
module.exports.uploadAlbum = function(req,res) {
    const doc = new AlbumModel({
        name: req.body.name, 
        user: req.userId,
        images: [],
        description: req.body.description
    }); 
    doc.save();
    res.json(doc);
};
module.exports.getAlbums = async function(req,res) {
    const albums = await AlbumModel.find().populate("images");
    res.send(albums);
};

module.exports.getMyAlbums = async function(req,res) {
    const albums = await AlbumModel.find({user:req.body.id}).populate("images");
    if(albums) res.send(albums);
    else res.send({value:null, message:"no album was found"});
};
module.exports.getOneAlbum = function(req,res) {
    AlbumModel.findById(req.params.id).populate("images").then(resp => res.send(resp));
};