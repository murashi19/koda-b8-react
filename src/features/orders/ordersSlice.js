import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart } from "@/features/auth/authSlice";
import api from "@/lib/axios";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id || o.orderId === id);
      if (order) order.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

// placeOrder tetap seperti sekarang — nanti kita ganti waktu endpoint checkout-nya sudah ada
export const placeOrder = (orderData) => (dispatch, getState) => {
  const { user } = getState().auth;
  if (!user) return false;

  const newOrder = {
    orderId: `ORD-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    customerName: user.name,
    ...orderData,
  };

  dispatch(addOrder(newOrder));
  dispatch(clearCart());

  return newOrder;
};
