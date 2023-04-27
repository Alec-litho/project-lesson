let jwt = require('jsonwebtoken');

module.exports.checkAuth = (req,res,next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if(token) {
        try {
            const decoded = jwt.verify(token, 'secret')
            req.userId = decoded._id
            next()
        } catch (error) {
            return res.status(403).json({
                message: "Not allowed"
            })
        }
    }else {
        return res.status(404).json({
            message: "Not allowed"
        })
    }
}