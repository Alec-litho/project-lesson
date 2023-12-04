const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const {UserModel} = require("../models/user");
const {AlbumModel} = require("../models/album");
const {getAge} = require("../helper_functions/getUserAge");

module.exports.register = async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const userAge = getAge(req.body.birth);
        // await bcrypt.hash(password, salt) error
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            avatarUrl: "https://i.ibb.co/Bqm8N2r/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg",
            friends: 0,
            location: "not mentioned",
            age: userAge
        });
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, "secret", {
            expiresIn: "30d"
        });
        const {passwordHash} = user._doc;
        const album = new AlbumModel({
            name: "All", 
            user: user._id
        });
        album.save();
        res.cookie("token", token);
        res.cookie("id", user._id.toString());
        res.json({token, _id:user._id});
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
};

module.exports.login = async(req,res) => {
    try {
        console.log("request body -->",req.body);
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: "user wasn't found"
            });
        }
        // console.log("user mongodb -->",user);
        const isValidPass = bcrypt.compare(req.body.password, user._doc.password);
        if(!isValidPass) {
            return res.status(404).json({
                message: "password is not correct"
            });
        }
        const token = jwt.sign({
            _id: user._id
        }, "secret", {
            expiresIn: "30d"
        });
        const {passwordHash} = user._doc;
        res.cookie("token", token);
        res.cookie("id", user._id.toString());
        res.json({token, _id:user._id});
    } catch (error) {
        res.status(500).json({
            message: "logging wasn't successful",
            err: error
        });
    }
};

module.exports.getMe = async(req,res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if(!user) {
            res.status(404).json({
                message: "user wasn't found"
            });
        }
        const {passwordHash, ...userData} = user._doc;
        res.json(userData);
    } catch (error) {
        res.status(404).json({message: "not working", value:error});
    };
};


