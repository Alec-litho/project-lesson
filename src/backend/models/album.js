
let mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',       
        required: true,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    description: {
        type: String,
    },
}, {
    timestamps: true
}) 

module.exports.AlbumModel = mongoose.model('Albums', AlbumSchema)