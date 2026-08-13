import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mapProduct } from "../products/productsSlice";
import { logout } from "@/features/auth/authSlice";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/wishlist");
      return res.data.data.map((entry) => mapProduct(entry.product));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/wishlist", { product_id: product.id });
    } catch (err) {
      if (err.response?.status !== 409) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
    await dispatch(fetchWishlist());
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistState(state) {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.status = "idle";
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
