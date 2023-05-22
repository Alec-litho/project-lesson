let {imageModel} = require('../models/image')
let {AlbumModel} = require('../models/album')
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find()
    res.send(images)
}
module.exports.uploadImage = async function(req,res) {
    let albumId = await AlbumModel.findOne({name:req.body.album}, '_id')
    let test = req.body
    console.log(req.body, req.userId);
    let doc = new imageModel({
        title: req.body.title,
        imageURL: req.body.imageURL,
        description: req.body.description,
        id: req.body.id,
        user: req.userId,
        album: albumId
    })
    doc.save()
    let album = await AlbumModel.findOne({name:req.body.album})
    album.images.push(doc)
    album.save()
    res.json(album)
}
module.exports.getOneImage = function(req,res) {
    const id = req.params.id
    imageModel.findOne({id: id}).then(resp => res.send(resp))
}
module.exports.deleteImage = (req,res) => {
    const id = req.params.id
    imageModel.deleteOne({_id: id}).then(resp => res.send(resp))
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
    const id = req.params.id
    const album = AlbumModel.findOne({id: id})
    res.send(album)
}