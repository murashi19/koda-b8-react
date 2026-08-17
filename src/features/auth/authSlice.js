import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengirim permintaan reset password",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        token,
        password,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengubah password",
      );
    }
  },
);

const initialState = {
  user: null,
  token: null,

  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,

  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout(state) {
      state.user = null;
      state.token = null;
    },

    updateUser(state, action) {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    clearForgotPasswordState(state) {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = false;
      state.forgotPasswordError = null;
    },

    clearResetPasswordState(state) {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = false;
      state.resetPasswordError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordSuccess = false;
        state.resetPasswordError = null;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
      });
  },
});

export const {
  login,
  logout,
  updateUser,
  clearForgotPasswordState,
  clearResetPasswordState,
} = authSlice.actions;

export default authSlice.reducer;
