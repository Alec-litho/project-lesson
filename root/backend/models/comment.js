const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
text: {
      type: String,
      trim: true,
      required: true
   }, 
user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
},
autherPicture: {
   type: String,
   required: true
},
autherName: {
   type: String,
   required: true
},
post: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Post"
   },
likes: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
}],
replies: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: "Comment"
}]
},  {
   timestamps: true
});

module.exports.CommentModel = mongoose.model("Comment", commentSchema);