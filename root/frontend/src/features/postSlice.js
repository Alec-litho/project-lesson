import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  posts: [],
  myPosts: undefined,
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
export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async (data) => {
  try {
    const response = await axios.post('http://localhost:3001/posts/myposts', { id: data.id })
    data.update(true)
    console.log(response);
    return response.data
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

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.myPosts = action.payload
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
  }
})

export default postSlice.reducer
