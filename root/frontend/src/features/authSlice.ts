import { createSlice, createAsyncThunk, createAction, createReducer, Action } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

interface InitialState {
  isAuth: boolean
  userToken: string
  userId: string
  userInfo: IUser | null
  status: string
  error: string | null
  role: string
}


const initialState:InitialState = {
  isAuth: false,
  userToken: '',
  userId: '',
  userInfo: {
    fullName: "Test",
    email: "test@gmail.com",
    password: "123",
    location: "not mentioned",
    friends: 0,
    age: 0,
    gender: "not mentioned",
    avatarUrl: "https://i.ibb.co/7YGBqxN/empty-Profile-Picture.webp",
    _id: "656395f24db3c1a422c2e8c9"
  },
  role: "anonymous",
  status: 'undefined',
  error: null
}


export const getUser = createAsyncThunk('auth/fetchData', async function({_id,token}:DefaultReduxThunkDto, {rejectWithValue}) {
  try {
    console.log(initialState,_id);
    const response = await axios.get(`http://localhost:3001/user/${_id}`,{headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }})
    return response.data
  }catch (err:any) {
      let error: AxiosError<PaymentValidationErrors> = err;
      if (!error.response) throw err;
      return rejectWithValue(error.response.data);
  }
})

export const loginUser = createAsyncThunk('auth/loginUser', async function(dto:ILoginUserDto, {rejectWithValue}) {
  try {
    const response:AxiosResponse<ILoginResponse> = await axios.post('http://localhost:3001/user/login', dto)
    return response.data
  } catch (err:any) {
      let error: AxiosError<PaymentValidationErrors> = err;
      if (!error.response) throw err;
      return rejectWithValue(error.response.data);
  }
})
export const registerUser = createAsyncThunk("auth/registerUser", async function(dto: ICreateUserDto, {rejectWithValue}) {
  try {
    const {data} = await axios.post("http://localhost:3001/user/register", dto);
    return data
  } catch (err:any) {
      let error: AxiosError<PaymentValidationErrors> = err;
      if (!error.response) throw err;
      return rejectWithValue(error.response.data);
  }
})

// export const getCookie = createReducer("auth/getCookie", function():{result:boolean, token:string,_id:string} {
//   let result = false;
//   let token:string = '';
//   let _id:string = '';
//   const cookies = document.cookie;
//   cookies.split(';').forEach(cookie => {
//     let key = cookie.split("=")[0].trim();
//     if(key === "token") {
//       result = !result;
//       token = cookie.split("=")[1].trim();
//     } else if(key === "id") {
//       _id = cookie.split("=")[1].trim();
//     }
//   });
//   return {result, token, _id};
// })
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    logout: (state, action) => {
      state.userInfo = null
    },
    getCookie: (state, action) => {
      let result = false;
      let token:string = '';
      let _id:string = '';
      const cookies = document.cookie;
      cookies.split(';').forEach(cookie => {
      let key = cookie.split("=")[0].trim();
      if(key === "token") {
        result = !result;
        token = cookie.split("=")[1].trim();
      } else if(key === "id") {
        _id = cookie.split("=")[1].trim();
      }});
      state.userToken = token;
      state.userId = _id
    },
    getInitialState: (state:InitialState, action) => {
      return {...state, userToken: action.payload.token}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.error = null;
        state.isAuth = true
        state.userId = action.payload._id
        state.userToken = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action:any) => {
        state.status = 'error';
        state.error = action.payload
      })
      .addCase(getUser.fulfilled, (state,action) => {
        state.status = 'fulfilled';
        state.error = null;
        if(state.userInfo !== null) {
          state.userInfo = action.payload
        } else {
          state.status = 'error'
        }
      })
      .addCase(getUser.rejected, (state,action:any) => {
        state.status = 'error';
        state.error = action.payload
      })
      // .addCase(getCookie.fulfilled, (state, action) => {
      //   console.log(action.payload);
      //   if(action.payload.result === true) {
      //     state.isAuth = true;
      //     state.userInfo._id = action.payload._id;
      //     state.token = action.payload.token;
      //   }
      // })
      .addCase(registerUser.fulfilled, (state,action) => {
        state.status = 'fulfilled';
        state.error = null;
        state.isAuth = true;
        state.userId = action.payload._id;
        state.userToken = action.payload.token;
      })
      .addCase(registerUser.rejected, (state,action:any) => {
        state.status = 'error';
        state.error = action.payload;
      })
  }
});
export const authReducer = authSlice.reducer
export const { logout, getCookie, getInitialState } = authSlice.actions
