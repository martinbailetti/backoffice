import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/slices/userSlice'
import pageReducer from '@/slices/pageSlice';
import tableReducer from '@/slices/tableSlice';
import appReducer from '@/slices/appSlice';
/* import { bridgeMiddleware } from './bridgeMiddleware' */


export const store = configureStore({
  reducer: {
    userData: userReducer,
    pageData: pageReducer,
    appData: appReducer,
    tableData: tableReducer,
  },
 // middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(bridgeMiddleware),
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
