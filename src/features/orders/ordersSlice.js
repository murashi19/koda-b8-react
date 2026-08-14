import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCartLocal } from "@/features/cart/cartSlice";
import { logout } from "@/features/auth/authSlice";
import api from "@/lib/axios";

// ---- Label status buat ditampilin ke user (fallback ke raw value kalau belum kemapping) ----
// Match persis sama enum order_status di DB: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
export const ORDER_STATUS_LABELS = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DELIVERED: "Terkirim",
  CANCELLED: "Dibatalkan",
};

// ---- Mapper: baris header order (GET /orders)
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
    items: (o.items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      image: item.product_image,
      price: Number(item.price),
      qty: item.qty,
      subtotal: Number(item.subtotal),
    })),
  };
}

// ---- Mapper: order detail (GET /orders/:id atau /admin/orders/:id)
function normalizeOrderDetail(o) {
  if (!o) return null;
  return {
    ...normalizeOrderSummary(o),
    customer: o.customer ? { full_name: o.customer.full_name } : undefined,
    user: o.user ? { email: o.user.email } : undefined,
    address: o.address
      ? {
          label: o.address.label,
          province: o.address.province,
          city: o.address.city,
          district: o.address.district,
          subdistrict: o.address.subdistrict,
          postalCode: o.address.postal_code,
          detail: o.address.address,
          note: o.address.note,
        }
      : null,
  };
}

// ---- Mapper: baris admin (GET /admin/orders)
function normalizeAdminOrderSummary(o) {
  return {
    ...normalizeOrderSummary(o),
    customer: {
      full_name: o.customer?.full_name,
      email: o.user?.email,
    },
    itemCount: Number(o.item_count ?? 0),
  };
}

function normalizeCheckoutOrder(o) {
  return {
    ...normalizeOrderSummary(o),
  };
}

const initialState = {
  orders: [], // ringkasan order (dari GET /orders)
  status: "idle",
  error: null,
  detailsById: {}, // detail order customer (GET /orders/:id)
  detailStatusById: {},
  placeOrderStatus: "idle",
  placeOrderError: null,
  adminOrders: [], // semua order semua customer (dari GET /admin/orders)
  adminOrdersStatus: "idle",
  adminOrdersError: null,
  adminDetailsById: {}, // detail order admin (GET /admin/orders/:id)
  adminDetailStatusById: {},
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

// Checkout: POST /orders. Backend yang narik item dari cart user,
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
      // Kosongkan Cart
      dispatch(clearCartLocal());
      return order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal membuat pesanan",
      );
    }
  },
);

// Belum ada payment gateway, jadi ini cuma nandain order sebagai sudah dibayar.
export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: "PAID",
      });
      return normalizeOrderSummary(res.data.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal memproses pembayaran",
      );
    }
  },
);

// ---- Admin: semua order semua customer ----
export const fetchAllOrdersAdmin = createAsyncThunk(
  "orders/fetchAllOrdersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/orders");
      return res.data.data.map(normalizeAdminOrderSummary);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchOrderDetailAdmin = createAsyncThunk(
  "orders/fetchOrderDetailAdmin",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      return normalizeOrderDetail(res.data.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Admin ubah status order ke status apapun (PROCESSING, SHIPPED, DELIVERED, CANCELLED, dst),
export const adminUpdateOrderStatus = createAsyncThunk(
  "orders/adminUpdateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      return normalizeOrderSummary(res.data.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? "Gagal mengubah status pesanan",
      );
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
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
        state.orders.unshift(order);
        state.detailsById[order.id] = order;
        state.detailStatusById[order.id] = "succeeded";
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrderStatus = "failed";
        state.placeOrderError = action.payload;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        const order = state.orders.find((o) => o.id === updated.id);
        if (order) order.status = updated.status;
        if (state.detailsById[updated.id]) {
          state.detailsById[updated.id].status = updated.status;
        }
      })
      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.adminOrdersStatus = "loading";
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.adminOrdersStatus = "succeeded";
        state.adminOrders = action.payload;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.adminOrdersStatus = "failed";
        state.adminOrdersError = action.payload;
      })
      .addCase(fetchOrderDetailAdmin.pending, (state, action) => {
        state.adminDetailStatusById[action.meta.arg] = "loading";
      })
      .addCase(fetchOrderDetailAdmin.fulfilled, (state, action) => {
        const detail = action.payload;
        if (!detail) return;
        state.adminDetailsById[detail.id] = detail;
        state.adminDetailStatusById[detail.id] = "succeeded";
      })
      .addCase(fetchOrderDetailAdmin.rejected, (state, action) => {
        state.adminDetailStatusById[action.meta.arg] = "failed";
      })
      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const order = state.adminOrders.find((o) => o.id === updated.id);
        if (order) order.status = updated.status;
        if (state.adminDetailsById[updated.id]) {
          state.adminDetailsById[updated.id].status = updated.status;
        }
      })
      .addCase(logout, (state) => {
        state.orders = [];
        state.status = "idle";
        state.checkoutStatus = "idle";
        state.error = null;
        state.adminOrders = [];
        state.adminOrdersStatus = "idle";
        state.adminDetailsById = {};
        state.adminDetailStatusById = {};
      });
  },
});

export default ordersSlice.reducer;
