import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    posts: [],
    myPosts: [{'createdAt': "2023-04-27T13:32:31.145+00:00", "comments":[]}],
    status: 'idle',
    error: null 
}  
export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async(data) => {
    const response = await axios.post("http://localhost:3001/posts/myposts", {id:data.id})
    data.update(true)
    return response.data
})

export const createPost = createAsyncThunk('posts/createPost', async(data) => {
  const response = await axios.post("http://localhost:3001/posts/",
    {text: data.text, tags: data.tags, id: data.id, imageUrl:data.imageUrl},
    {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${data.token}`}
  })
  data.update(false)
  return response.data
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: [],
    extraReducers: builder => {
        builder
          .addCase(fetchMyPosts.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.myPosts = action.payload
          })
          .addCase(fetchMyPosts.rejected, (state, action) => {
            state.status = 'error'
            state.error = 'erorr'
          })
    }
})

export default postSlice.reducer