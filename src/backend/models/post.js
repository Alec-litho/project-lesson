//MVC right now its model
let mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                              //relation-ship
        required: true,
    }, 
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }], 
}, {
    timestamps: true
}) 

module.exports.PostModel = mongoose.model('Post', PostSchema)