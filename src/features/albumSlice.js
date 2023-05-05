import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from 'axios'

const initialState = {
    albums: [],
    status: 'idle'
}
export const fetchMyAlbums = createAsyncThunk("albums/fetchMyAlbums", (data) => {
    return axios.post('http://localhost:3001/albums/myalbums', {id: data.userid}, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${data.token}`
        }
    }).then(res => res.data).catch(err => console.log(err))
})
export const savePicture = createAsyncThunk("albums/savePicture", async(data) => {
    await axios.post('http://localhost:3001/images', JSON.stringify(data.picture), {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${data.token}`
            }
        })
})
const albumSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder 
          .addCase(fetchMyAlbums.fulfilled, (state,action) => {
            console.log(action.payload);
            state.status = 'fulfilled'
            state.albums = action.payload
          })
          .addCase(savePicture.fulfilled, (state,action) => {
            console.log('loadded');
            state.status = 'fulfilled'
          })
    }
})

export const albumReducer = albumSlice.reducer