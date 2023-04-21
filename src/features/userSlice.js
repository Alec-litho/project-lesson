import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
const currUserId = 1


export const fetchData = createAsyncThunk('data/fetchData', async () => {
    try {
        const response = await axios.get('https://api.jsonbin.io/v3/b/644143c3ebd26539d0af1bad', {
            headers: {
                "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
            }
        })
        return [...response.data.record]
    } catch(err) {
        console.log('error')
    }
    
})

let initialState = {
    userPosts: [],
    userInfo: {},
    userDialogs: [],
    status: 'idle',//"loading" | "succeded" | "failed"
    error: null
}

 const getUserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        // search: async(state,action) => {
        //     const response = await axios.get('https://api.jsonbin.io/v3/b/64413cfbebd26539d0af171c', {
        //         headers: {
        //             "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
        //         }
        //     })
        //     state.userData = response

        // }
    },
    extraReducers: builder => {
        builder 
           .addCase(fetchData.pending, (state, action) => {
              state.status = 'loading'
           })
           .addCase(fetchData.fulfilled, (state, action) => {
            state.status = 'succeded'
            let userData = action.payload.filter(user => user.userId === currUserId)
            state.userPosts = userData[0].posts
            state.userInfo = {name: userData[0].userFirstname, lastName: userData[0].userLastname,  age: userData[0].userAge, profilePicture: userData[0].userProfilePicture, friends: userData[0].fiends, subscriptions: userData[0].subscriptions, location: userData[0].location}
            state.userDialogs = userData[0].dialogs
            })
    }
})
export default getUserDataSlice.reducer
export const {search} = getUserDataSlice.actions