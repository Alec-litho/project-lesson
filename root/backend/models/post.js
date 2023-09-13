//MVC right now its model
const mongoose = require("mongoose");

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
        ref: "User",                              //relation-ship
        required: true,
    }, 
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }], 
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
}); 

module.exports.PostModel = mongoose.model("Post", PostSchema);