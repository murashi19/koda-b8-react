import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from "@/features/auth/authSlice";
import { ordersWithMeta as demoOrders } from "@/features/orders/data/order";

const initialState = {
  orders: demoOrders,
};

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
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

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
