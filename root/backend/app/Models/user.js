//MVC right now its model
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: String,
    friends: Number,
    age: String,
    avatarUrl: {
        type: String,
        default: "https://i.ibb.co/7YGBqxN/empty-Profile-Picture.webp"
    }

}, {
    timestamps: true
}); 

module.exports.UserModel = mongoose.model("User", UserSchema); 