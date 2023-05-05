import {configureStore,combineReducers} from '@reduxjs/toolkit'
import  getUserDataSlice from '../features/userSlice.js'
import postSlice from '../features/postSlice.js'
import {albumReducer} from '../features/albumSlice.js'
import {authReducer} from '../features/authSlice.js'

const rootReducer = combineReducers({
    main: getUserDataSlice,
    userPosts: postSlice,
    auth: authReducer,
    albums: albumReducer
})
export const store = configureStore({
    reducer: rootReducer
})