import { createSlice } from '@reduxjs/toolkit';

export const adminSlice = createSlice({
   name: "Admin",
   initialState: {
      admin: null
   },
   reducers: {
      setAdmin: (state, action) => {
         if (action.payload === null) {
            localStorage.removeItem('token')
         } else {
            localStorage.setItem("token", JSON.stringify(action.payload))
         }

         state.admin = action.payload;
      },
      setAdminData: (state, action) => {
         if(action.payload === null) {
            state.admin = null;
         } else {
            state.admin = action.payload;
         }
      }
   }
})

export const {
   setAdmin,
   setAdminData
} = adminSlice.actions;

export default adminSlice.reducer;