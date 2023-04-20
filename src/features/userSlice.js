import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"



export const fetchData = createAsyncThunk('data/fetchData', async () => {
    try {
        const response = await axios.get('https://api.jsonbin.io/v3/b/64413cfbebd26539d0af171c', {
            headers: {
                "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
            }
        })
        return [...response.data.record]
    } catch(err) {
        return err
    }
    
})

let initialState = {
    userData: {},
    status: 'idle',//"loading" | "succeded" | "failed"
    error: null
}

 const getUserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        search: async(state,action) => {
            const response = await axios.get('https://api.jsonbin.io/v3/b/64413cfbebd26539d0af171c', {
                headers: {
                    "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
                }
            })
            state.userData = response

        }
    },
    extraReducers: builder => {
        builder 
        //    .addCase([fetchData.pending], (state, action) => {
        //       state.status = 'loading'
        //    })
           .addCase([fetchData.fulfilled], (state, action) => {
            state.status = 'succeded'
            console.log(action.payload)
           })
    }
})
export default getUserDataSlice.reducer
export const {search} = getUserDataSlice.actions