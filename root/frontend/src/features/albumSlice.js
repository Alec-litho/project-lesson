import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  albums: [], 
  status: 'idle',
  updatingPictures: false
}
// export const fetchMyAlbums = createAsyncThunk('albums/fetchMyAlbums', (data) => { 
//   console.log(data);
//   axios.post('http://localhost:3001/albums/myalbums', { id: data.userid }, {
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${data.token}`
//   }
// })

export const fetchMyAlbums = createAsyncThunk('albums/fetchMyAlbums', async (data) => {
  let result = await axios.post('http://localhost:3001/albums/myalbums', {id:data.userid}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`
    }
  })
  if (data.update) data.update(true)
  console.log(result.data.value === null,result.data);
  if(result.data.value === null) return []
  return result.data

})


export const fetchAlbum = createAsyncThunk('albums/fetchAlbum', (data) => axios.get('http://localhost:3001/albums/:id', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`
  }
}))
export const fetchImg = createAsyncThunk('albums/fetchImg', (data) => axios.get(`http://localhost:3001/images/${data._id}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`
  }
}))
export const savePicture = createAsyncThunk('albums/savePicture', (data) => axios.post('http://localhost:3001/images', JSON.stringify(data.picture), {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.myData.token}`
  }
}).then((res) => {
  if (data.update)data.setUpdate()
  return res.data
}))
export const deletePicture = createAsyncThunk('albums/deletePicture', (data) => {
  axios.delete(`http://localhost:3001/images/${data.id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`
    }
  }).then((res) => { if (data.update) data.update() })
})

export const uploadAlbum = createAsyncThunk('albums/createAlbum', async (data) => {
  console.log(data, data.user)
  await axios.post('http://localhost:3001/albums', { name: data.name, user: data.user, description: data.desc }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`
    }
  }).then((res) => data.update())
})
const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAlbums.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = 'fulfilled'
        state.albums = action.payload
      })

      .addCase(savePicture.fulfilled, (state, action) => {
        console.log(action)
        state.status = 'fulfilled'
      })
      .addCase(deletePicture.fulfilled, (state, action) => {
        console.log('deleted')
        state.status = 'fulfilled'
      })
      .addCase(fetchImg.fulfilled, (state, action) => {

      })
  }
})

export const albumReducer = albumSlice.reducer
