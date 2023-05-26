
let mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                         
        required: true,
    },
    description: {
        type: String,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    imageURL: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      default: Date.now
     },
    })

module.exports.imageModel = mongoose.model('Image', imageSchema)