import { createSlice } from "@reduxjs/toolkit";

// Inisiasi state
const initialState = {
  user: null,
  token: null,
};

// Membuat Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      ((state.user = null), (state.token = null));
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
