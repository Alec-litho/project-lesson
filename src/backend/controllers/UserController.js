let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
let {validationResult} = require('express-validator')
const {UserModel} = require('../models/user')//DB

module.exports.register = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            avatarUrl: "https://i.ibb.co/7YGBqxN/empty-Profile-Picture.webp",
            friends: 0,
            location: "not mentioned",
            age: 'not mentioned'
        })
        const user = await doc.save();
    
        const token = jwt.sign({
            _id: user._id
        }, 'secret', {
            expiresIn: '30d'
        });
        console.log(user);
        const {passwordHash, ...userData} = user._doc;
        res.json({
            userData,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: "Not successful logging"
        })
    }
}

module.exports.login = async(req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if(!user) {
            return res.status(404).json({
                message: "user wasn't found"
            })
        }
        console.log(user);
        const isValidPass = bcrypt.compare(req.body.password, user._doc.password)//await triggered error idk why
        if(!isValidPass) {
            return res.status(404).json({
                message: "login or password is not correct"
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {
            expiresIn: '30d'
        });
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: "logging wasn't successful",
            err: error
        })
    }
}

module.exports.getMe = async(req,res) => {
    try {
        let user = await UserModel.findById(req.userId)
        if(!user) {
            res.status(404).json({
                message: "user wasn't found"
            })
        }
        const {passwordHash, ...userData} = user._doc;
        res.json(userData)
    } catch (error) {
        res.status(404).json({message: 'not working'})
    }
}