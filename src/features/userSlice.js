import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

export const fetchData = createAsyncThunk('data/fetchData', async (token) => {
    try {
        const response = await axios.get('http://localhost:3001/auth/me', {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data
    } catch(err) {
        console.log('error')
    }
    
})

let initialState = {
    userInfo: {name: '', age: "",profilePicture:"",friends:"",location:""},
    userDialogs: [],
    status: 'idle',//"loading" | "succeded" | "failed"
    error: null
}

 const getUserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        updatePosts: (state, action) => {

        }
    },
    extraReducers: builder => {
        builder 
           .addCase(fetchData.pending, (state, action) => {
              state.status = 'loading'
           })
           .addCase(fetchData.fulfilled, (state, action) => {
            state.status = 'succeded'
            state.userInfo.age =  action.payload.age
            state.userInfo.name = action.payload.fullName
            state.userInfo.profilePicture = action.payload.avatarUrl
            state.userInfo.friends = action.payload.friends
            state.userInfo.location = action.payload.location
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'error'
                state.error = "error"
            })
    }
})
export default getUserDataSlice.reducer
export const {updatePosts} = getUserDataSlice.actions