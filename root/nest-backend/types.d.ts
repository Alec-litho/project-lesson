
//----------------------DTO's-------------------------

//------------User---------------//
 interface ICreateUserDto {
    password: string
    email: string
    fullName: string
    age: number
    gender: string
}
interface ILoginUserDto {
    password: string
    email: string
}
interface IUpdateUserDto {

}
//------------User---------------//

//------------Image---------------//
interface ICreateImageDto {
    title: string
    album: string 
    description: string 
    imageURL: string
    postId: boolean 
    user: string 
}
interface IDeleteImageDto {
    id: string
}
interface IUpdateImageDto {
    title: string
    album: any
    description: string 
    imageURL: string
    oldImgId: string | boolean
}
//------------Image---------------//

//------------Comment---------------//
interface ICreateCommentDto {
    text: string
    user: string
    post:string
    replyTo:string
}
interface ILikeComment {
    userId: string
}
interface IUpdateCommentDto {
    text: string
    _id: string
}
//------------Comment---------------//

//------------Album---------------//
interface ICreateAlbumDto {
    name: string;
    user: string;
    description: string;
}
//------------Album---------------//

//------------Post---------------//
interface ICreatePostDto {
    text: string
    tags: string[]
    author: string
    images: ImageModel[] | []
}
interface IUpdatePostDto {
    text: string
    tags: string[]
    images: ImageModel[]
}
//------------Post---------------//

//----------------------MODELS----------------------//

//------------Image---------------//
interface ImageModel {
    title: string; 
    user: mongoose.Types.ObjectId; 
    description: string;
    album: mongoose.Types.ObjectId;
    imageURL: string;
    postId: mongoose.Types.ObjectId | Boolean
    _id: mongoose.Types.ObjectId 
}