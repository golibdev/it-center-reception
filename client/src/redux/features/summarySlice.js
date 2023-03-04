import { createSlice } from '@reduxjs/toolkit';

export const summarySlice = createSlice({
   name: "Summary",
   initialState: {
      summary: null
   },
   reducers: {
      setData: (state, action) => {
         state.summary = action.payload;
      }
   }
})

export const {
   setData
} = summarySlice.actions;

export default summarySlice.reducer;