import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface InitialState {
  albums: IAlbumModel[] | []
  status: string
  updatingPictures: boolean
  userToken: string
  error: errorResponse
}

const initialState:InitialState = {
  albums: [], 
  status: 'idle',
  updatingPictures: false,
  userToken: "",
  error: {
    message: "",
    value: null
  }
}

type errorResponse = {
  message: string
  value: any
}
export const fetchMyAlbums = createAsyncThunk('albums/fetchMyAlbums', async function({_id,token}:DefaultReduxThunkDto, api):Promise<IAlbumModel[] | [] | errorResponse> {
  try {
    const globalState:any = api.getState();
    const albumState = globalState.albums as InitialState
    console.log(albumState);
    
    let result = await axios.get(`http://localhost:3001/albums/user/${_id}`, {headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    }})
    if(result.data.value === null) return [];
    return result.data;
  } catch (error:any) {
    return {message: error.response.data, value:error.response.code}
  }
  
})


export const fetchAlbum = createAsyncThunk('albums/fetchAlbum', async function({_id,token}:DefaultReduxThunkDto):Promise<IAlbumModel> {
  try {
    const response = await axios.get(`http://localhost:3001/albums/${_id}`,{headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
       accept: "*/*",
       credentials: "include"
    }})
    return response.data
  } catch (error:any) {
    return error
  }
})


export const fetchImg = createAsyncThunk('albums/fetchImg', async function({_id,token}:DefaultReduxThunkDto):Promise<ImageModel> {
  const response = await axios.get(`http://localhost:3001/images/${_id}`, {headers: {
    'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
  }}); 
  return response.data
})
export const uploadImage = createAsyncThunk('albums/uploadImage', async ({image,token}:{image:CreateImageDto,token:string},api):Promise<ImageModel> => {
    const globalState:any = api.getState();
    const albumState = globalState.albums as InitialState
    console.log(image,albumState);
    const {data} = await axios.post('http://localhost:3001/image', JSON.stringify(image), {headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }})

    return data

})

 
export const deletePicture = createAsyncThunk('albums/deletePicture', async({_id,token}:DefaultReduxThunkDto):Promise<boolean> => {
  try {
    const response = await axios.delete(`http://localhost:3001/image/${_id}`, {headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    }});
    return response.data;
  } catch(err:any) {
    return err
  }
})

export const uploadAlbum = createAsyncThunk('albums/createAlbum', async ({album,token}:{album:CreateAlbumDto,token:string}):Promise<IAlbumModel> => {
  try {
    console.log(album)
    const response = await axios.post('http://localhost:3001/albums', album, {headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    }});
    return response.data;
  } catch(err:any) {
    return err
  }
})
const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setToken: (state:InitialState, action) => {
      state.userToken = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAlbums.fulfilled, (state, action) => {
        console.log(action.payload);
        if(Array.isArray(action.payload)) {
          console.log('w');
          
          const albums = action.payload as IAlbumModel[] | [] 
          state.status = 'fulfilled'
          state.albums = albums
        } else {
          const error = action.payload as errorResponse
          state.error = error
        }
 
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
export const { setToken } = albumSlice.actions