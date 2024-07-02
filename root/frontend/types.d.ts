
type errorResponse = {
    message: string
    value: any
  }



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
interface ILoginResponse {
    token: string
    _id: string
}
interface IUpdateUserDto {

}
//------------User---------------//

//------------Image---------------//
interface CreateImageDto {
    title: string
    album: string | Boolean
    description: string 
    imageURL: string
    postId: string | Boolean 
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
interface CreateCommentDto {
    text: string
    user: string 
    post:string
    replyTo:string | Boolean
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
interface CreateAlbumDto {
    name: string;
    user: string;
    description: string;
}
//------------Album---------------//

//------------Post---------------//
interface CreatePostDto {
    text: string
    author: string
    images: ImageModel[] | []
}
interface IUpdatePostDto {
    text: string
    tags: string[]
    images: ImageModel[]
}
type currPostType = { 
    itemId:string,
    watched:boolean,
    positionY:number
}
//------------Post---------------//


//----------Notifications----------//

interface NotificationMessage {
    _id: string
    sender: string
    receiver: string
    text: string
    date: string
    type: string
    viewed: boolean
}

//----------Notifications----------//

//----------------------MODELS----------------------//

//------------Image---------------//
interface ImageModel {
    title: string; 
    user: string | IUser;  
    description: string;
    album: string | Boolean;
    imageURL: string;
    postId: string | Boolean;
    _id: string;
    createdAt: string
}
//------------Album---------------//
interface IAlbumModel {
    name: string
    user: string
    images: ImageModel[]
    description: string
    _id: string
  }

interface IUser {
    fullName: string,
    email: string,
    password: string,
    location: string,
    friends: number,
    age: number,
    gender: string,
    avatarUrl: string,
    _id: string
  }
interface IPost {
    text: string
    tags: string[] | []
    viewCount: number
    author: IUser | string
    images: ImageModel[] | []
    comments: CommentModel[] | []
    likes: string[]
    shares: string[]
    _id: string
    createdAt: Date
}
interface CommentModel {
    _id: string
    user: IUser | string
    text: string 
    replyTo: Boolean
    replies: CommentModel[] | string
    post: string 
    likes: IUser[] | string
    created_at: string
    
}


interface DefaultReduxThunkDto {
    _id: string
    token: string
}