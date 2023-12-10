import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

interface InitialState {
  userToken: string
  posts: IPost[]
  myPosts: IPost[]
  status: string
  error: string | null
}
interface ApiHeaders  {
  'Content-Type': string
  Authorization: string
}

const initialState:InitialState = {
  userToken: "",
  posts: [],
  myPosts: [],
  status: 'idle',
  error: null
}
const headers:ApiHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${initialState.userToken}` 
}

export const uploadComment = createAsyncThunk('posts/postComment', async function(dto: ICreateCommentDto):Promise<IComment> {
  console.log("Test - do headers have real value?",dto);
  if(!initialState.userToken) throw new Error("Token is not defined")
  try{
    const response = await axios.post(`http://localhost:3001/comment/`,JSON.stringify(dto),{headers: {...headers}})
    return response.data
  } catch(err) {
    console.log(err);
    return err
  }
  
})
type ApiArgs = {
  dto:ICreateCommentDto
  id:string
}
export const uploadReply = createAsyncThunk('posts/postReply', async function({dto,id}:ApiArgs):Promise<IComment> {
  try {
    if(!initialState.userToken) throw new Error("Token is not defined")
    const response = await axios.post(`http://localhost:3001/comment/${id}`,JSON.stringify(dto),{headers: {...headers}})
    return response.data
  } catch (error) {
    return error
  }
})

type fetchPostsType = {
  id: string
  postLength: number
}
export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async ({id, postLength}:fetchPostsType,{rejectWithValue}) => {
  try {
    if(!initialState.userToken) throw new Error("Token is not defined")
    console.log('in slice', postLength);
    const response = await axios.get(`http://localhost:3001/post/user/${id}`,{headers: {...headers}})
    return {posts:[...response.data].reverse(), postLength};
  } catch(err) {
    let error: AxiosError<PaymentValidationErrors> = err // cast the error for access
    if (!error.response) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }
})
type createPostType = {
  dto: ICreatePostDto
  token: string
}

export const createPost = createAsyncThunk('posts/createPost', async ({dto}:createPostType,{rejectWithValue}) => {
  try {
    if(!initialState.userToken) throw new Error("Token is not defined")
    const response = await axios.post('http://localhost:3001/posts/',JSON.stringify(dto),{headers: {...headers}});
    return response.data;
  } catch (err) {
    let error: AxiosError<PaymentValidationErrors> = err
    if (!error.response) throw err
    return rejectWithValue(error.response.data)
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async(id, {rejectWithValue}) => {
  try {
    if(!initialState.userToken) throw new Error("Token is not defined")
    let response = await axios.delete(`http://localhost:3001/posts/${id}`,{headers:{...headers}});
    return response.data;
  }catch (err) {
    let error: AxiosError<PaymentValidationErrors> = err
    if (!error.response) throw err
    return rejectWithValue(error.response.data)
  }
  
})
export const watched = createAsyncThunk('posts/watched', async function(id:string):Promise<boolean> {
  try {
    if(!initialState.userToken) throw new Error("Token is not defined")
    const response = await axios.get(`http://localhost:3001/post/watched/${id}`,{headers: {...headers}});
    return response.data;
  } catch (error) {
    return error
  }

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
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        console.log('w');
        state.status = 'fulfilled'
        let posts = [...action.payload.posts]
        let postLength = action.payload.postLength 
        let slicedPosts = posts.slice(postLength, postLength+10)
        console.log(slicedPosts);
        state.myPosts = [...state.myPosts, ...slicedPosts]
      })
      .addCase(fetchMyPosts.rejected, (state, action:any) => {
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
      .addCase(deletePost.fulfilled, (state,action) => {
        console.log(action.payload);
        state.status = 'fulfilled';
        state.error = null;
        state.myPosts = [...state.myPosts].filter(post => post._id !== action.payload._id);
      })
      .addCase(deletePost.rejected, (state,action:any) => {
        state.status = 'error'
        state.error = action.payload
      })
  }
})

export default postSlice.reducer
