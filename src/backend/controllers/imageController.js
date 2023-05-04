let {imageModel} = require('../models/image')
let {albumModel} = require('../models/album')
module.exports.getAllImages = function(req,res) {
    const images = imageModel.find()
    res.send(images)
}
module.exports.uploadImage = async function(req,res) {
    let albumId = await albumModel.findOne({name:req.body.album}, '_id')
    let test = req.body
    let doc = new imageModel({
        title: req.body.title,
        imageURL: req.body.imageURL,
        description: req.body.description,
        id: req.body.id,
        user: req.userId,
        album: albumId
    })
    console.log(test);
    doc.save()
    let album = await albumModel.findOne({name:req.body.album})
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
    imageModel.deleteOne({id: id}).then(resp => res.send(resp))
}
module.exports.uploadAlbum = function(req,res) {
    let doc = new albumModel({
        name: req.body.name,
        id: req.body.id,
        user: req.userId,
    })
    doc.save()
    res.json(doc)
}
module.exports.getAlbums = async function(req,res) {
    const albums = await albumModel.find().populate('images')
    res.send(albums)
}
module.exports.getOneAlbum = function(req,res) {
    const id = req.params.id
    const album = albumModel.findOne({id: id})
    res.send(album)
}