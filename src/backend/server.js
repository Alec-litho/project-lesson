let express = require('express')
let mongoose = require('mongoose')
let {registerValidation, loginValidation, postCreateValidation, imageValidation} = require('./validations')
const cors = require("cors");
const {checkAuth} = require('./utils/checkAuth')
const {register, login, getMe} = require('./controllers/UserController')
const {create, getAll, getOne, deletePost, update, getMyPosts} = require('./controllers/postController')
const {uploadImage, getOneImage, getAllImages, getOneAlbum, getAlbums, uploadAlbum, deleteImage, getMyAlbums} = require('./controllers/imageController')
const multer = require('multer')

mongoose
  .connect('mongodb+srv://opaltaco:eamV2B1PXGjNFX3y@cluster0.iyapupi.mongodb.net/blog?retryWrites=true&w=majority')
  .then(res => console.log('ok'))
  .catch(err => console.log(err))
let app = express()

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname)
//   },
// })

// const upload = multer({storage})
app.use('/uploads', express.static('uploads'))
app.use(cors());
app.use(express.json())//enable json format for express
//user paths----------------------------------------
app.post('/auth/login', loginValidation, login)
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/register', registerValidation, register)
//post paths----------------------------------------
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts/myposts', getMyPosts) 
app.post('/posts', checkAuth, postCreateValidation, create)
app.delete('/posts/:id', checkAuth, deletePost)
app.patch('/posts',checkAuth, update)//dont forget to finish it
//images paths---------------------------------------
app.get('/images',getAllImages)
app.get('/images/:id', getOneImage)
app.delete('/images/:id', checkAuth, deleteImage)
app.post('/images', checkAuth, imageValidation, uploadImage)
app.post('/albums/myalbums', checkAuth, imageValidation, getMyAlbums)
app.get('/albums',getAlbums)
app.get('/albums/:id', getOneAlbum)
app.post('/albums', checkAuth, uploadAlbum)
//storage------------------------------------------
// app.post('/upload', checkAuth, upload.single('uploads'), (req,res) => {
//   res.json({
//     url: `/uploads/${req.file.originalname}`
//   })
// })
app.listen(3001, (w) => {
    console.log('server started');
})
