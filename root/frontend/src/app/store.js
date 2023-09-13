import { configureStore, combineReducers } from '@reduxjs/toolkit'
import postSlice from '../features/postSlice'
import { albumReducer } from '../features/albumSlice'
import { authReducer } from '../features/authSlice'

const rootReducer = combineReducers({
  userPosts: postSlice,
  auth: authReducer,
  albums: albumReducer
})
export default configureStore({
  reducer: rootReducer
})
