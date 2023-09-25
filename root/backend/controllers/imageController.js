const {imageModel} = require("../models/image");
const {AlbumModel} = require("../models/album");
const {ObjectId} = require("mongodb");
const { isRouteErrorResponse } = require("react-router-dom");
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find();
    res.send(images);
};
//-----------------------------I need to fix this fucntion------------------------------//
//a lot of weird useless stuff to get rid of
module.exports.uploadImage = async function(req,res) {
    try {
        console.log('req.body --> ',req.body);
        // const albumId = await AlbumModel.findById(req.body.albumId) 
        const album = req.body.hasAlbum? await AlbumModel.findById(req.body.albumId) : undefined;
        const albumName = album? album.name.toString() : undefined
        console.log(album,albumName);
        const doc = new imageModel({ 
            title: req.body.title,
            imageURL: req.body.imageURL,
            description: req.body.description,
            user: req.userId,
            album: albumName,
            post: req.body.post
        });

        if(album) {
            console.log('album exists');
            // const album = await AlbumModel.findOne({name:req.body.albumId});
            doc.save();
            album.images.push(doc);
            album.save();
            console.log('after saved in album');
            res.json(album);
        } else {
            doc.save();
            console.log('after saved ',doc);
            res.json(doc);
        } 
    } catch(err) {
        console.log(err);
    }
   

};
//-----------------------------I need to fix this fucntion------------------------------//

module.exports.updateImage = function(req,res) {
    imageModel.findByIdAndUpdate(req.params.id, {post: true}).then(resp => res.send(resp));
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