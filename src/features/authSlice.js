import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from 'axios'
const initialState = {
    data: null,
    status: 'loading'
}
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async(params) => {
    const {data} = await axios.post('/auth/login', params)
    return data
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.data = null
        }
        
    },
    extraReducers: builder => {
        builder
          .addCase(fetchAuth.pending, (state, action) => {
            state.status = 'loading'
            state.data = null
          })
          .addCase(fetchAuth.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
          })
          .addCase(fetchAuth.rejected, (state, action) => {
            state.status = 'error'
          })
    }
})
export const authReducer = authSlice.reducer
export const selectIsAuth = state => Boolean(state.auth.data)
export const {logout} = authSlice.actions