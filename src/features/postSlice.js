import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    posts: [],
    myPosts: [{'createdAt': "2023-04-27T13:32:31.145+00:00"}],
    status: 'idle',
    error: null
}
export const fetchMyPosts = createAsyncThunk('getPosts/fetchMyPosts', async(userId) => {
    console.log(userId);
    const response = await axios.post("http://localhost:3001/posts/myposts", {id:userId})
    return response.data
})
export const deletePost = createAsyncThunk('addPost/fetchPosts', async(post) => {
    let result;
    // await axios.get(userDataBin, {headers: {"X-MASTER-KEY": userDBkey}}).then(data => {
    //     let userData = data.filter(user => user.userId === currUserId)[0]
    //     // userData.posts.filter
    //     axios.put(userDataBin,{...userData, posts: [...initialState.posts, post]}, {
    //         headers: {"X-MASTER-KEY": userDBkey}}).then( _ => result = userData.posts)
    // })
    return result
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: [],
    extraReducers: builder => {
        builder
          .addCase(fetchMyPosts.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            console.log(action.payload);
            state.myPosts = action.payload
          })
          .addCase(fetchMyPosts.rejected, (state, action) => {
            state.status = 'error'
            state.error = 'erorr'
          })
          .addCase(deletePost.fulfilled, (state, action) => {
            state.status = 'fulfilled'
          })
    }
})

export default postSlice.reducer