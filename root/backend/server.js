const express = require("express");
const mongoose = require("mongoose");
const {registerValidation, loginValidation, postCreateValidation, imageValidation} = require("./validations");
const cors = require("cors");
const {checkAuth} = require("./utils/checkAuth");
const {register, login, getMe} = require("./controllers/UserController");
const {create, getAll, getOne, deletePost, update, getMyPosts, getPostImages, getComments, postComment, postReply, deleteComment,postSmashLike, postRemoveLike} = require("./controllers/postController");
const {uploadImage, getOneImage, getAllImages, getOneAlbum, getAlbums, uploadAlbum, deleteImage, getMyAlbums, updateImage} = require("./controllers/imageController");
const multer = require("multer");

mongoose
  .connect("mongodb+srv://opaltaco:eamV2B1PXGjNFX3y@cluster0.iyapupi.mongodb.net/blog?retryWrites=true&w=majority")
  .then(res => console.log("ok"))
  .catch(err => console.log(err));
const app = express();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname)
//   },
// })

// const upload = multer({storage})
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());//enable json format for express

//auth paths----------------------------------------
app.post("/auth/login", loginValidation, login);
app.post("/auth/me", checkAuth, getMe);
app.post("/auth/register", registerValidation, register);
//posts paths----------------------------------------
app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create); 
app.post("/posts/images", getPostImages);
app.post("/posts/myposts", getMyPosts); 
app.delete("/posts/:id", checkAuth, deletePost);
app.patch("/posts",checkAuth, update);//dont forget to finish it
// app.get('/posts/comments/:id', getComments)
app.post("/posts/comments/:id", postComment);
app.post("/posts/comments/:id", postReply);
app.delete("/posts/comments/:id", checkAuth, deleteComment);
app.post("/posts/like", postSmashLike);
app.post("/posts/removeLike", postRemoveLike);
//images paths---------------------------------------
app.get("/images",getAllImages);
app.get("/images/:id", getOneImage);
app.post("/images/update/:id", updateImage);
app.delete("/images/:id", checkAuth, deleteImage);
app.post("/images", checkAuth, imageValidation, uploadImage);
app.post("/albums/myalbums", checkAuth, imageValidation, getMyAlbums);
app.get("/albums",getAlbums);
app.get("/albums/:id", getOneAlbum);
app.post("/albums", checkAuth, uploadAlbum);
//storage------------------------------------------
// app.post('/upload', checkAuth, upload.single('uploads'), (req,res) => {
//   res.json({
//     url: `/uploads/${req.file.originalname}`
//   })
// })
app.listen(3001, (w) => {
    console.log("server started");
});
