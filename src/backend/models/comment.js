const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
text: {
      type: String,
      trim: true,
      required: true
   },
user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
},
autherPicture: {
   type: String,
   required: true
},
autherName: {
   type: String,
   required: true
},
date: {
   type: Date,
   default: Date.now
   },
post: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Post'
   },
likes: {
   type: Number
   },
replies: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Comment'
}]
 })

module.exports.commentModel = mongoose.model('Comment', commentSchema);