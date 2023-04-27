let {body} = require('express-validator')

const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
]
const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isURL(),
]

const postCreateValidation = [
    body('title', 'Write title of the post').isLength({min:5}).isString(),
    body('text', 'Write text of the post').isLength({min:5}).isString(),
    body('tags', "Tags' format is not correct").optional().isArray(),
    body('imageUrl', "Image url is not correct").optional().isString(),
]

module.exports = {
    loginValidation,
    registerValidation,
    postCreateValidation
}