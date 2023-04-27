let express = require('express')
let mongoose = require('mongoose')
let {registerValidation, loginValidation, postCreateValidation} = require('./validations')
const cors = require("cors");
const {checkAuth} = require('./utils/checkAuth')
const {register, login, getMe} = require('./controllers/UserController')
const {create, getAll, getOne, deletePost} = require('./controllers/postController')


mongoose
  .connect('mongodb+srv://opaltaco:eamV2B1PXGjNFX3y@cluster0.iyapupi.mongodb.net/blog?retryWrites=true&w=majority')
  .then(res => console.log('ok'))
  .catch(err => console.log(err))
let app = express()
app.use(cors());
app.use(express.json())//enable json format for express
//user paths----------------------------------------
app.post('/auth/login', loginValidation, login)
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/register', registerValidation, register)
//post paths----------------------------------------
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, create)
app.delete('/posts/:id', deletePost)
// app.patch('/posts', update)

app.listen(3001, (w) => {
    console.log('w');
})
