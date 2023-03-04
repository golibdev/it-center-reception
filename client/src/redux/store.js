import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './features/adminSlice';
import summarySlice from './features/summarySlice';

const store = configureStore({
   reducer: {
      admin: adminSlice,
      summary: summarySlice
   }
})

export default store;