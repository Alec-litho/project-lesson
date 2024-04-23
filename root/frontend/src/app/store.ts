import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit'
import postSlice from '../features/postSlice'
import { albumReducer } from '../features/albumSlice'
import { authReducer } from '../features/authSlice'

const rootReducer = combineReducers({
  posts: postSlice,
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
