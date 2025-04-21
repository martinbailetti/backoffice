import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/slices/userSlice';

export const mockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      userData: userReducer,
    },
    preloadedState: initialState,
  });
};
