import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  message: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showLoginModal: {
      reducer(state, action) {
        state.visible = true;
        state.message = action.payload;
      },
      prepare(message = "") {
        return { payload: message };
      },
    },
    hideLoginModal(state) {
      state.visible = false;
      state.message = "";
    },
  },
});

export const { showLoginModal, hideLoginModal } = modalSlice.actions;
export default modalSlice.reducer;
