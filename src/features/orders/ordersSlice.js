import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCartLocal } from "@/features/cart/cartSlice";
import { logout } from "@/features/auth/authSlice";
import api from "@/lib/axios";

// ---- Label status buat ditampilin ke user (fallback ke raw value kalau belum kemapping) ----
export const ORDER_STATUS_LABELS = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Dibayar",
  PROCESSED: "Diproses",
  PACKED: "Dikemas",
  SHIPPED: "Dikirim",
  DELIVERED: "Terkirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

// ---- Mapper: baris header order (GET /orders) -> shape frontend ----
function normalizeOrderSummary(o) {
  return {
    id: o.id,
    orderCode: o.order_code,
    addressId: o.address_id,
    shippingMethod: o.shipping_method,
    paymentMethod: o.payment_method,
    shippingCost: Number(o.shipping_cost),
    subtotal: Number(o.subtotal),
    total: Number(o.total),
    status: o.status,
    createdAt: o.created_at,
  };
}

// ---- Mapper: baris flat hasil JOIN order+order_items (GET /orders/:id) -> 1 order + items[] ----
function normalizeOrderDetail(rows) {
  if (!rows?.length) return null;
  const first = rows[0];
  return {
    ...normalizeOrderSummary(first),
    items: rows.map((r) => ({
      productId: r.product_id,
      name: r.name,
      image: r.image,
      price: Number(r.price),
      qty: r.qty,
      subtotal: Number(r.subtotal),
    })),
  };
}

// ---- Mapper: response order dari POST /orders (checkout) -> shape frontend ----
// Beda dari GetOrderDetail: items di sini udah di-nest sama backend, gak perlu digroup manual.
function normalizeCheckoutOrder(o) {
  return {
    ...normalizeOrderSummary(o),
    items: (o.items ?? []).map((r) => ({
      productId: r.product_id,
      name: r.name,
      image: r.image,
      price: Number(r.price),
      qty: r.qty,
      subtotal: Number(r.subtotal),
    })),
  };
}

const initialState = {
  orders: [], // ringkasan order (dari GET /orders)
  status: "idle",
  error: null,
  detailsById: {}, // orderId -> { ...order, items: [...] }
  detailStatusById: {}, // orderId -> idle | loading | succeeded | failed
  placeOrderStatus: "idle", // idle | loading | succeeded | failed
  placeOrderError: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders");
      return res.data.data.map(normalizeOrderSummary);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchOrderDetail = createAsyncThunk(
  "orders/fetchOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      return normalizeOrderDetail(res.data.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Checkout beneran: POST /orders. Backend yang narik item dari cart user,
// validasi stok, insert order + order_items, kurangin stok, dan kosongin cart_items.
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (
    { addressId, shippingMethod, paymentMethod },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await api.post("/orders", {
        addressId,
        shippingMethod,
        paymentMethod,
      });
      const order = normalizeCheckoutOrder(res.data.data);
      // Backend udah ngosongin cart_items di DB, sinkronin state lokal juga
      dispatch(clearCartLocal());
      return order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal membuat pesanan",
      );
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
      })
      .addCase(fetchOrderDetail.pending, (state, action) => {
        state.detailStatusById[action.meta.arg] = "loading";
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        const detail = action.payload;
        if (!detail) return;
        state.detailsById[detail.id] = detail;
        state.detailStatusById[detail.id] = "succeeded";
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.detailStatusById[action.meta.arg] = "failed";
      })
      .addCase(placeOrder.pending, (state) => {
        state.placeOrderStatus = "loading";
        state.placeOrderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeOrderStatus = "succeeded";
        const order = action.payload;
        // Tampilin langsung di history tanpa nunggu refetch
        state.orders.unshift(order);
        // Detail item-nya udah ada dari response checkout, cache sekalian
        state.detailsById[order.id] = order;
        state.detailStatusById[order.id] = "succeeded";
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrderStatus = "failed";
        state.placeOrderError = action.payload;
      })
      .addCase(logout, (state) => {
        state.orders = [];
        state.status = "idle";
        state.checkoutStatus = "idle";
        state.error = null;
      });
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
