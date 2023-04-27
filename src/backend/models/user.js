//MVC right now its model
let mongoose = require('mongoose')

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
    avatarUrl: String,

}, {
    timestamps: true
}) 

module.exports.UserModel = mongoose.model('User', UserSchema)