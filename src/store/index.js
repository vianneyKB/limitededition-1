import { configureStore } from '@reduxjs/toolkit';
import modelBrowserReducer from './modelBrowserSlice';

export const store = configureStore({
  reducer: {
    modelBrowser: modelBrowserReducer,
  },
});


export const global = {
  materials: null
}