import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ---- Mapper: snake_case (backend) -> camelCase (frontend) ----
export function mapAddress(a) {
  return {
    id: a.id,
    label: a.label,
    address: a.address,
    province: a.province,
    city: a.city,
    district: a.district ?? "",
    subdistrict: a.subdistrict ?? "",
    postalCode: a.postal_code ?? "",
    note: a.note ?? "",
    isDefault: Boolean(a.is_default),
  };
}

// ---- Mapper: camelCase (form) -> snake_case (backend payload) ----
function toPayload(form) {
  return {
    label: form.label,
    address: form.address,
    province: form.province,
    city: form.city,
    district: form.district || null,
    subdistrict: form.subdistrict || null,
    postal_code: form.postalCode || null,
    note: form.note || null,
  };
}

// ---- Thunks ----
export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/addresses");
      return res.data.data.map(mapAddress);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (form, { rejectWithValue }) => {
    try {
      const res = await api.post("/addresses", toPayload(form));
      return mapAddress(res.data.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ id, ...form }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/addresses/${id}`, toPayload(form));
      return mapAddress(res.data.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/addresses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Backend belum ada endpoint khusus "set default" (misal PATCH /addresses/:id/default),
// jadi di-handle manual di frontend lewat 2x PUT:
// - alamat yang dipilih -> is_default: true
// - alamat lama yang isDefault -> is_default: false
// Kalau nanti backend nambahin endpoint khusus, tinggal sederhanakan thunk ini.
export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefaultAddress",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().addresses;
      const target = items.find((a) => a.id === id);
      const prevDefault = items.find((a) => a.isDefault && a.id !== id);

      if (!target) throw new Error("Alamat tidak ditemukan");

      const requests = [
        api.put(`/addresses/${id}`, {
          ...toPayload(target),
          is_default: true,
        }),
      ];

      if (prevDefault) {
        requests.push(
          api.put(`/addresses/${prevDefault.id}`, {
            ...toPayload(prevDefault),
            is_default: false,
          }),
        );
      }

      await Promise.all(requests);
      return { id, prevDefaultId: prevDefault?.id ?? null };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  items: [],
  status: "idle", // status fetch list: idle | loading | succeeded | failed
  mutationStatus: "idle", // status add/edit/delete/setDefault
  error: null,
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create
      .addCase(createAddress.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })

      // Update
      .addCase(updateAddress.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAddress.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })

      // Set default
      .addCase(setDefaultAddress.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const { id, prevDefaultId } = action.payload;
        state.items = state.items.map((a) => {
          if (a.id === id) return { ...a, isDefault: true };
          if (a.id === prevDefaultId) return { ...a, isDefault: false };
          return a;
        });
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
