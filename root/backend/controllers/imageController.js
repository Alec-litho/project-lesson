const {imageModel} = require("../models/image");
const {AlbumModel} = require("../models/album");
const {ObjectID} = require("mongodb");
const { isRouteErrorResponse } = require("react-router-dom");
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find();
    res.send(images);
};
module.exports.uploadImage = async function(req,res) {
    const albumId = req.body.album? await AlbumModel.findOne({name:req.body.album}, "_id") : undefined;
    const test = req.body;

    const doc = new imageModel({ 
        title: req.body.title,
        imageURL: req.body.imageURL,
        description: req.body.description,
        user: req.userId,
        album: albumId? albumId : undefined,
        post: req.body.post
    });
    if(req.body.album) {
        const album = await AlbumModel.findOne({name:req.body.album});
        doc.save();
        album.images.push(doc);
        album.save();
        res.json(album);
    } else {
        doc.save();
        res.json(doc);
    }

};

module.exports.updateImage = function(req,res) {
    const id = new ObjectID(`${req.params.id}`);  
    imageModel.updateOne({"_id":id}, {post: true}).then(resp => res.send(resp));
};
module.exports.getOneImage = function(req,res) {
    const id = new ObjectID(`${req.params.id}`);  
    imageModel.findOne({"_id": id}).then(resp => res.send(resp));
};
module.exports.deleteImage = (req,res) => {
    const id = req.params.id;
    imageModel.deleteOne({"_id": id}).then(resp => res.send(resp));
};
module.exports.uploadAlbum = function(req,res) {
    console.log( req.body, req.userId);
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
    console.log("getmyalbums --> ",req.body.id, albums);
    if(albums) res.send(albums);
    else res.send({value:null, message:"no album was found"});
};
module.exports.getOneAlbum = function(req,res) {
    const id = new ObjectID(`${req.params.id}`);
    AlbumModel.findOne({"_id": id}).populate("images").then(resp => res.send(resp));
};