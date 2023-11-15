import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  posts: [],
  myPosts: [],
  status: 'idle',
  error: null
}
export const postComment = createAsyncThunk('posts/postComment', async(data) => {
  console.log(data);
  try{
    const response = await axios.post(`http://localhost:3001/posts/comments/${data.postId}`,
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` }}
      )
      return response.data
  } catch(err) {
    console.log(err);
  }
  
})

export const postReply = createAsyncThunk('posts/postReply', async(data) => {
  try {
    const response = await axios.post(`http://localhost:3001/posts/reply/${data.commentId}`,
    {text: data.text, user: data.user, authorPicture: data.authorPicture, authorName: data.authorName, post: data.post, replyTo: data.replyTo},
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` } }
    )
  } catch (error) {
    
  }
})

export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async (data) => {
  try {
    console.log('in slice', data, data.id);
    const response = await axios.post('http://localhost:3001/posts/myposts', { id: data.id });
    console.log('w');
    return {posts:[...response.data].reverse(), postLength:data.postLength};
  } catch(error) {
    console.log(error);
  }
})

export const createPost = createAsyncThunk('posts/createPost', async (data) => {
  const response = await axios.post(
    'http://localhost:3001/posts/',
    {
      text: data.text, tags: data.tags, id: data.id, imageUrl: data.imageUrl
    },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` } }
  )
  data.update(false)
  return response.data
})

export const deletePost = createAsyncThunk('posts/deletePost', async(data) => {
  console.log(data);
  let response = await axios.delete(`http://localhost:3001/posts/${data.postId}`,
  {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${data.token}`}}
  )
  
  return response.data
})
export const watched = createAsyncThunk('posts/watched', async(postId) => {
  await axios.post('http://localhost:3001/posts/watched', {postId},{headers: {'Content-Type': 'application/json'}})
})

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: [],
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
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.status = 'error'
        state.error = 'erorr'
      })
      .addCase(postComment.fulfilled, (state,action) => {
        state.myPosts = [...state.myPosts].map(post => {
          console.log(action.payload);
          if(post._id === action.payload._id) return action.payload   
          else return post
        })
      })
      .addCase(createPost.fulfilled, (state, action) => {
        let reversedArr = [...state.myPosts].reverse();
        state.myPosts = [...reversedArr, action.payload].reverse();
      })
      .addCase(deletePost.fulfilled, (state,action) => {
        console.log(action.payload);
        state.myPosts = [...state.myPosts].filter(post => post._id !== action.payload._id)
      })
  }
})

export default postSlice.reducer
