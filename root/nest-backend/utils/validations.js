const {body} = require("express-validator");

const loginValidation = [
    body("email").isEmail(),
    body("password").isLength({min:5}),
];
const registerValidation = [
    body("email").isEmail(),
    body("password").isLength({min:5})
];

const postCreateValidation = [
    body("text", "Write text for the post").isLength({min:5}).isString(),
    body("tags", "Tags' format is not correct").optional().isArray(),
    body("imageUrl", "Image url is not correct").optional().isString(),
];
const imageValidation = [
    body("title", "Write title for image").isLength({min:1}).isString(),
];
module.exports = {
    loginValidation,
    registerValidation,
    postCreateValidation,
    imageValidation
};