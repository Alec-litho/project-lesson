import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from 'axios'

const initialState = {
    albums: [],
    status: 'idle',
    updatingPictures: false
}
export const fetchMyAlbums = createAsyncThunk("albums/fetchMyAlbums", (data) => {
    return axios.post('http://localhost:3001/albums/myalbums', {id: data.userid}, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${data.token}`
        }
    }).then(res => {
        if(data.update) data.update(true)
        return res.data
    }).catch(err => console.log(err))
})
export const savePicture = createAsyncThunk("albums/savePicture", async(data) => {
    await axios.post('http://localhost:3001/images', JSON.stringify(data.picture), {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${data.myData.token}`
            }
        }).then(res => data.setUpdate())
})
export const deletePicture = createAsyncThunk("albums/deletePicture", async(data) => {
    await axios.delete(`http://localhost:3001/images/${data.id}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${data.token}`
            }
        }).then(res => data.update())
})

export const uploadAlbum = createAsyncThunk("albums/createAlbum", async(data) => {
    console.log(data, data.user);
    await axios.post(`http://localhost:3001/albums`,{name: data.name, user:data.user, description:data.desc}, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${data.token}`
            }
        }).then(res => data.update())
})
const albumSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder 
          .addCase(fetchMyAlbums.fulfilled, (state,action) => {
            state.status = 'fulfilled'
            state.albums = action.payload
          })
          
          .addCase(savePicture.fulfilled, (state,action) => {
            console.log(action);
            state.status = 'fulfilled'

          })
          .addCase(deletePicture.fulfilled, (state,action) => {
            console.log('deleted');
            state.status = 'fulfilled'
          })
    }
})

export const albumReducer = albumSlice.reducer