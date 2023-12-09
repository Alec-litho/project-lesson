import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface initialState {
  albums: []
}

const initialState = {
  albums: [], 
  status: 'idle',
  updatingPictures: false
}

export const fetchMyAlbums = createAsyncThunk('albums/fetchMyAlbums', async (id:string, token):Promise<IAlbumModel | []> => {
  let result = await axios.get(`http://localhost:3001/albums/user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  console.log(result.data.value === null,result.data);
  if(result.data.value === null) return []
  return result.data

})


export const fetchAlbum = createAsyncThunk('albums/fetchAlbum', ({}) => axios.get('http://localhost:3001/albums/:id', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`
  }
}))

/*
export const fetchImg = createAsyncThunk('albums/fetchImg', (_id:string, token):Promise<ImageModel> => axios.get(`http://localhost:3001/images/${_id}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}))
export const saveImage = createAsyncThunk('albums/uploadImage', async (dto:ICreateImageDto,token):Promise<ImageModel> => {
  console.log(dto);
  try {
    const response = await axios.post('http://localhost:3001/image', JSON.stringify(data.imgData), {
    headers: {
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}`
    }
  })
  console.log(response);
  // if (data.update)data.setUpdate()
  return response.data

  } catch(err) {
    return err
  }
})
*/

/*THESE FUNCTIONS SHOULD BE DIFFERENT*/
export const deletePicture = createAsyncThunk('albums/deletePicture', async(dto:IDeleteImageDto, token):Promise<boolean> => {
  const response = await axios.delete(`http://localhost:3001/image/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
})

export const uploadAlbum = createAsyncThunk('albums/createAlbum', async (dto:ICreateAlbumDto, token):Promise<IAlbumModel> => {
  console.log(dto)
  const response = await axios.post('http://localhost:3001/albums', { dto }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })/*.then((res) => data.update())*/
  return response.data
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

      .addCase(uploadImage.fulfilled, (state, action) => {
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
