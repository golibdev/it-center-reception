import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './features/adminSlice';

const store = configureStore({
   reducer: {
      admin: adminSlice
   }
})

export default store;