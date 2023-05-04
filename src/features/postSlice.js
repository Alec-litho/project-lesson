import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
const userDataBin = 'https://api.jsonbin.io/v3/b/644143c3ebd26539d0af1bad' // JSONBin.io
const userDBkey = "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
const currUserId = 1
const initialState = {
    posts: [],
    status: 'idle',
    error: null
}
export const fetchPosts = createAsyncThunk('getPosts/fetchPosts', async() => {
    const response = await axios.get("http://localhost:3001/posts")
    return response.data
})
export const deletePost = createAsyncThunk('addPost/fetchPosts', async(post) => {
    console.log(post);
    let result;
    await axios.get(userDataBin, {headers: {"X-MASTER-KEY": userDBkey}}).then(data => {//get data from users bin
        let userData = data.filter(user => user.userId === currUserId)[0]//get current user's data
        // userData.posts.filter
        axios.put(userDataBin,{...userData, posts: [...initialState.posts, post]}, {//update posts in user bin
            headers: {"X-MASTER-KEY": userDBkey}}).then( _ => result = userData.posts)
    })
    return result
})

const postSlice = createSlice({
    name: 'userPosts',
    initialState,
    reducers: [],
    extraReducers: builder => {
        builder
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.posts = userData.posts
          })
          .addCase(deletePost.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.posts = action.payload
          })
    }
})

export default postSlice.reducer