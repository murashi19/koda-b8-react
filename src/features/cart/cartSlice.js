import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "@/features/auth/authSlice";

const normalizeCartItem = (row) => ({
  id: row.id, // cart_item id -> dipakai buat DELETE /cart/:id
  productId: row.product_id, // product id asli
  name: row.name,
  brand: row.brand,
  image: row.image,
  qty: row.quantity,
  isSelected: row.is_selected,
  regularPrice: Number(row.regular_price),
  discountPrice: row.discount_price ? Number(row.discount_price) : null,
  price: Number(row.price),
  subtotal: Number(row.subtotal),
});

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/carts");
      return data.data.map(normalizeCartItem);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal memuat keranjang",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, qty }, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/carts", {
        product_id: productId,
        quantity: qty,
      });
      await dispatch(fetchCart()); // refetch biar harga/subtotal selalu sinkron sama server
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal menambah ke keranjang",
      );
    }
  },
);

export const updateCartQty = createAsyncThunk(
  "cart/updateCartQty",
  async ({ cartItemId, qty }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/carts/${cartItemId}`, { quantity: qty });
      await dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal mengubah jumlah",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await api.delete(`/carts/${cartItemId}`);
      return cartItemId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal menghapus item",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null, removingId: null },
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.status = "idle";
        state.error = null;
      })
      .addCase(removeFromCart.pending, (state, action) => {
        state.removingId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.removingId = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
