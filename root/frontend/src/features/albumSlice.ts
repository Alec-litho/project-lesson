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
const headers:ApiHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${initialState.userToken}`,
  accept: "*/*",
  credentials: "include"
}
type errorResponse = {
  message: string
  value: any
}
export const fetchMyAlbums = createAsyncThunk('albums/fetchMyAlbums', async function(data:any):Promise<IAlbumModel[] | [] | errorResponse> {
  try {
    let result = await axios.get(`http://localhost:3001/albums/user/${data._id}`, {headers: {...headers}})
    console.log(result.data.value === null,result.data);
    if(result.data.value === null) return [];
    // if(result.data.code === "ERR_BAD_REQUEST") return {message: "ERR_BAD_REQUEST", value: result.data.response}
    return result.data;
  } catch (error:any) {
    return {message: error.response.data, value:error.response.code}
  }
  
})


export const fetchAlbum = createAsyncThunk('albums/fetchAlbum', async function(id:string):Promise<IAlbumModel> {
  try {
    const response = await axios.get(`http://localhost:3001/albums/${id}`, {headers: {...headers}})
    return response.data
  } catch (error:any) {
    return error
  }
})


export const fetchImg = createAsyncThunk('albums/fetchImg', async function(_id:string):Promise<ImageModel> {
  const response = await axios.get(`http://localhost:3001/images/${_id}`, {headers: {...headers}});
  return response.data
})
export const uploadImage = createAsyncThunk('albums/uploadImage', async (dto:ICreateImageDto):Promise<ImageModel> => {
  try {
    const response = await axios.post('http://localhost:3001/image', JSON.stringify(dto), {headers: {...headers}})
    console.log(response);
    // if (data.update)data.setUpdate()
    return response.data
  } catch(err:any) {
    return err
  }
})

 
export const deletePicture = createAsyncThunk('albums/deletePicture', async(dto:IDeleteImageDto):Promise<boolean> => {
  try {
    const response = await axios.delete(`http://localhost:3001/image/${dto.id}`, {headers: {...headers}});
    return response.data;
  } catch(err:any) {
    return err
  }
})

export const uploadAlbum = createAsyncThunk('albums/createAlbum', async (dto:ICreateAlbumDto):Promise<IAlbumModel> => {
  try {
    console.log(dto)
    const response = await axios.post('http://localhost:3001/albums', { dto }, {headers: {...headers}});/*.then((res) => data.update())*/
    return response.data;
  } catch(err:any) {
    return err
  }
})
const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    getInitialState: (state:InitialState, action) => {
      state.userToken = action.payload.token
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
export const { getInitialState } = albumSlice.actions