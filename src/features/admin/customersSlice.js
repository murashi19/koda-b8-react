import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function formatRupiah(value) {
  const number = Math.round(Number(value) || 0);
  return `Rp ${number.toLocaleString("id-ID")}`;
}

function mapCustomer(u) {
  return {
    id: u.id,
    name: u.full_name || u.email,
    email: u.email,
    phone: u.phone_number || null,
    avatar: u.avatar || null,
    city: u.city || "-",
    joinDate: u.created_at
      ? new Date(u.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-",
    totalOrders: Number(u.total_orders) || 0,
    totalSpending: Number(u.total_spending) || 0,
    totalSpendingFormatted: formatRupiah(u.total_spending),
    isVerified: Boolean(u.is_verified),
    isActive: Boolean(u.is_active),
  };
}

// GET ALL CUSTOMERS
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (queryString = "", { rejectWithValue }) => {
    try {
      const url = queryString ? `/users?${queryString}` : "/users";
      const res = await api.get(url);
      return {
        items: (res.data.data || []).map(mapCustomer),
        stats: res.data.stats || {
          total_customers: 0,
          new_this_month: 0,
          avg_orders: 0,
        },
        pagination: res.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil data pelanggan",
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  stats: {
    total_customers: 0,
    new_this_month: 0,
    avg_orders: 0,
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.stats = action.payload.stats;
        const pagination = action.payload.pagination;
        state.pagination = {
          currentPage: pagination.page ?? 1,
          itemsPerPage: pagination.limit ?? 10,
          totalItems: pagination.total ?? 0,
          totalPages: pagination.totalPages ?? 0,
          hasNextPage: pagination.hasNextPage ?? false,
          hasPreviousPage: pagination.hasPreviousPage ?? false,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPage } = customersSlice.actions;
export default customersSlice.reducer;
