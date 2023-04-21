import {configureStore,combineReducers} from '@reduxjs/toolkit'
import  getUserDataSlice from '../features/userSlice.js'


const rootReducer = combineReducers({
    main: getUserDataSlice
})
export const store = configureStore({
    reducer: rootReducer
})