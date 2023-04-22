import {configureStore,combineReducers} from '@reduxjs/toolkit'
import  getUserDataSlice from '../features/userSlice.js'
import postSlice from '../features/postSlice.js'

const rootReducer = combineReducers({
    main: getUserDataSlice,
    userPosts: postSlice
})
export const store = configureStore({
    reducer: rootReducer
})