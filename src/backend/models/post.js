//MVC right now its model
let mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true
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
    imageUrl: String,
}, {
    timestamps: true
}) 

module.exports.PostModel = mongoose.model('Post', PostSchema)