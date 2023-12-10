import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit'
import postSlice from '../features/postSlice.ts'
import { albumReducer } from '../features/albumSlice.ts'
import { authReducer } from '../features/authSlice.ts'

const rootReducer = combineReducers({
  userPosts: postSlice,
  auth: authReducer,
  albums: albumReducer
})
function makeStore() {
  const store = configureStore({
    reducer: rootReducer
  });
  return store;
}

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
export type AppDispatch = typeof store.dispatch
