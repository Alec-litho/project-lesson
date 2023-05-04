
let mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                              //relation-ship
        required: true,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    id: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
}) 

module.exports.albumModel = mongoose.model('Album', AlbumSchema)