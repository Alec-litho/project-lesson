import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isAuth: false,
  token: '',
  userInfo: {
    _id: '',
    fullName: '',
    email: '',
    password: '',
    location: '',
    friends: 0,
    age: '',
    avatarUrl: 'https://i.ibb.co/Bqm8N2r/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
  },
  status: 'undefined'
}
export const fetchData = createAsyncThunk('auth/fetchData', async ({token,_id}) => {
  console.log(token,_id);
  try {
    const response = await axios.post('http://localhost:3001/auth/me', {userId:_id},{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    )
    return response.data
  } catch (err) {
    console.log(err);
  }
})

export const loginUser = createAsyncThunk('auth/loginUser', async (params) => {
  const { data } = await axios.post('/auth/login', params)
  console.log(data);
  return data
})
export const getCookie = createAsyncThunk("auth/getCookie", async() => {
  let result = false;
  let token;
  let _id;
  const cookies = document.cookie;
  cookies.split(';').forEach(cookie => {
    let key = cookie.split("=")[0].trim();
    if(key === "token") {
      result = !result;
      token = cookie.split("=")[1].trim();
    } else if(key === "id") {
      _id = cookie.split("=")[1].trim();
    }
  });
  return {result, token, _id};
})
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    logout: (state, action) => {
      state.data = null
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = 'success'
        state.isAuth = true
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
      })
      .addCase(fetchData.fulfilled, (state,action) => {
        console.log(action.payload);
        state.userInfo._id = action.payload._id
        state.userInfo.fullName = action.payload.fullName;
        state.userInfo.age = action.payload.age;
        state.userInfo.avatarUrl = action.payload.avatarUrl;
        state.userInfo.email = action.payload.email;
        state.userInfo.friends = action.payload.friends;
        state.userInfo.location = action.payload.location;
      })
      .addCase(getCookie.fulfilled, (state, action) => {
        console.log(action.payload);
        if(action.payload.result === true) {
          state.isAuth = true;
          state.userInfo._id = action.payload._id;
          state.token = action.payload.token;
        }
      })
  }
});
export const authReducer = authSlice.reducer
export const { logout } = authSlice.actions
