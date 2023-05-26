let {imageModel} = require('../models/image')
let {AlbumModel} = require('../models/album')
let {ObjectID} = require('mongodb')
const { isRouteErrorResponse } = require('react-router-dom')
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find()
    res.send(images)
}
module.exports.uploadImage = async function(req,res) {
    let albumId = req.body.album !== undefined? await AlbumModel.findOne({name:req.body.album}, '_id') : undefined
    let test = req.body

    let doc = new imageModel({
        title: req.body.title,
        imageURL: req.body.imageURL,
        description: req.body.description,
        user: req.userId,
        album: albumId != undefined? albumId : null
    })
    if(req.body.album!=undefined) {
        let album = await AlbumModel.findOne({name:req.body.album})
        doc.save()
        album.images.push(doc)
        album.save()
        res.json(album)
    } else {
        doc.save()
        res.json(doc)
    }

}
module.exports.getOneImage = function(req,res) {
    const id = new ObjectID(`${req.params.id}`)  
    imageModel.findOne({"_id": id}).then(resp => res.send(resp))
}
module.exports.deleteImage = (req,res) => {
    const id = req.params.id
    imageModel.deleteOne({"_id": id}).then(resp => res.send(resp))
}
module.exports.uploadAlbum = function(req,res) {
    console.log( req.body, req.userId);
    let doc = new AlbumModel({
        name: req.body.name, 
        user: req.userId,
        images: [],
        description: req.body.description
    })
    doc.save()
    res.json(doc)
}
module.exports.getAlbums = async function(req,res) {
    const albums = await AlbumModel.find().populate('images')
    res.send(albums)
}

module.exports.getMyAlbums = async function(req,res) {
    const albums = await AlbumModel.find({user:req.body.id}).populate('images')
    console.log(req.body.id);
    res.send(albums)
}
module.exports.getOneAlbum = function(req,res) {
    const id = new ObjectID(`${req.params.id}`)
    AlbumModel.findOne({"_id": id}).populate('images').then(resp => res.send(resp))
}