import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

interface InitialState {
  userToken: string
  posts: IPost[]
  myPosts: IPost[]
  status: string
  error: string | null
}
const initialState:InitialState = {
  userToken: "",
  posts: [],
  myPosts: [],
  status: 'idle',
  error: null
}


export const uploadComment = createAsyncThunk('posts/postComment', async function({comment,token}:{comment:CreateCommentDto,token:string}):Promise<CommentModel> {
  try{
    console.log(comment);
    
    const response:AxiosResponse<CommentModel,any> = await axios.post(`http://localhost:3001/comment/`,comment, {headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }})
    console.log(response.data);
    
    return response.data
  } catch(err:any) {
    console.log(err);
    return err
  }
  
})

export const uploadReply = createAsyncThunk('posts/postReply', async function({comment,id,token}:{comment:CreateCommentDto,id:string,token:string}):Promise<CommentModel> {
  try {
    console.log(comment);
    
    const response = await axios.post(`http://localhost:3001/comment/${id}`,comment,{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }})
    return response.data
  } catch (err:any) {
    return err
  }
})
export const likePostComment = createAsyncThunk('posts/likePostComment', async function({commentId,userId,token}:{commentId:string,userId:string,token:string}):Promise<CommentModel | undefined> {
  try {
    console.log(userId);
    
    const response = await axios.post(`http://localhost:3001/comment/like/${commentId}`, {userId}, {headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }})
    console.log(response);
    return response.data
  } catch (error) {
    console.log(error);
    
  }

})
export const removeLikeCommentReducer = createAsyncThunk('posts/removeLikeCommentReducer', async function({commentId,userId,token}:{commentId:string,userId:string,token:string}):Promise<CommentModel | undefined> {
  try {
    console.log(userId);
    const response = await axios.post(`http://localhost:3001/comment/remove-like/${commentId}`, {userId}, {headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }})
    console.log(response);
    return response.data
  } catch (error) {
    console.log(error);
    
  }

})
export const deleteCommentReducer = createAsyncThunk('posts/deletePostReducer', async({commentId,token}:{commentId:string,token:string}, {rejectWithValue}) => {
  try {
    const response = await axios.delete(`http://localhost:3001/comment/${commentId}`,{headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }})
  }catch (err:any) {
   console.log(err);
   
  }
  
})
export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async ({_id,token,count}:{_id:string,token:string,count?:number},{rejectWithValue}):Promise<{posts:IPost[] | []}> => {
  const path = count? `http://localhost:3001/post/user/${_id}/params?count=${count}` : `http://localhost:3001/post/user/${_id}/params?`
  const response = await axios.get(path,{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }})
    console.log(_id,response);
    return {posts:[...response.data].reverse()};
})

export const createPost = createAsyncThunk('posts/createPost', async ({post, token}:{post:CreatePostDto,token:string},{rejectWithValue}) => {
    console.log(post);
    const {data}:{data:IPost} = await axios.post('http://localhost:3001/post',JSON.stringify(post),{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }});
    return data;
})

export const deletePostReducer = createAsyncThunk('posts/deletePostReducer', async({postId,token}:{postId:string,token:string}, {rejectWithValue}) => {
  try {
    let response = await axios.delete(`http://localhost:3001/post/${postId}`,{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }});
    return response.data;
  }catch (err:any) {
    let error: AxiosError<PaymentValidationErrors> = err
    if (!error.response) throw err
    return rejectWithValue(error.response.data)
  }
  
})
export const watched = createAsyncThunk('posts/watched', async function({id,token}:{id:string,token:string}):Promise<boolean> {
  try {
    const response = await axios.get(`http://localhost:3001/post/watched/${id}`,{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }});
    return response.data;
  } catch (err:any) {
    return err
  }

})
export const removeRecommendation = createAsyncThunk('posts/removeRecommendation', async function({postId,userId}:{postId:string,userId:string}):Promise<boolean> {
  const response = await axios.post(`http://localhost:3001/post/remove-recommendation/${postId}`,postId)
  return response.data
})
export const uploadLikePost = createAsyncThunk('posts/like', async function({id,userId}:{id:string,userId:string}):Promise<boolean> {
  console.log(userId);
  
  const response = await axios.post(`http://localhost:3001/post/liked/${id}`, {userId})
  return response.data
})
export const removeLikePost = createAsyncThunk('posts/removeLikePost', async function({id,userId}:{id:string,userId:string}):Promise<boolean> {
  const response:AxiosResponse<boolean> = await axios.post(`http://localhost:3001/post/remove-like/${id}`, {userId})
  return response.data
})
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getInitialState: (state:InitialState, action) => {
      state.userToken = action.payload.token
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        console.log('w');
        state.status = 'fulfilled'
        let posts = [...action.payload.posts]
        console.log(posts);
        state.myPosts = [...state.myPosts, ...posts]
      })
      .addCase(fetchUserPosts.rejected, (state, action:any) => {
        state.status = 'error'
        state.error = action.payload
      })
      .addCase(uploadComment.fulfilled, (state,action) => {
        state.myPosts = [...state.myPosts].map((post):IPost => {//iterate through myPosts array to find post whose id matches the id of the post that was commented
          if(post._id === action.payload.post) {
            post.comments = [...post.comments, action.payload]//add new comment
            return post;
          }
          else return post
        })
      })
      .addCase(uploadComment.rejected, (state,action:any) => {
        state.status = 'error'
        state.error = action.payload
      } )
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.error = null;
        let reversedArr = [...state.myPosts].reverse();
        state.myPosts = [...reversedArr, action.payload].reverse();
      })
      .addCase(createPost.rejected, (state, action:any) => {
        state.status = 'error'
        state.error = action.payload
      })
      .addCase(deletePostReducer.fulfilled, (state,action) => {
        console.log(action.payload);
        state.status = 'fulfilled';
        state.error = null;
        state.myPosts = [...state.myPosts].filter(post => post._id !== action.payload._id);
      })
      .addCase(deletePostReducer.rejected, (state,action:any) => {
        state.status = 'error'
        state.error = action.payload
      })
  }
})


export default postSlice.reducer
