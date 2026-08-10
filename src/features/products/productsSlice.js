import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function formatRupiah(value) {
  const number = Math.round(Number(value));
  return `Rp ${number.toLocaleString("id-ID")}`;
}

export function mapProduct(p) {
  const regularPrice = Number(p.regular_price);
  const discountPrice =
    p.discount_price != null ? Number(p.discount_price) : null;

  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    image: p.image,
    category: p.category_name,
    categoryId: p.category_id ?? null,
    regularPrice, // number, dipakai untuk kalkulasi & badge
    discountPrice, // number | null
    regularPriceFormatted: formatRupiah(regularPrice),
    discountPriceFormatted:
      discountPrice != null ? formatRupiah(discountPrice) : null,
    rating: Number(p.rating),
    review: p.review_count ?? p.review ?? 0,
    tags: p.tags ?? [],
    stock: p.stock,
    description: p.description ?? "",
  };
}

function mapProductDetail(p) {
  return {
    ...mapProduct(p),
    description: p.description ?? "",
    specifications: p.specifications ?? "",
    images: p.images?.length ? p.images : [p.image],
  };
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products");
      return res.data.data.map(mapProduct);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return mapProductDetail(res.data.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// ---- Admin CRUD: semuanya beneran hit backend (bukan lokal doang) ----

// formData: FormData berisi brand, name, category_id, regular_price,
// discount_price, stock, description, dan file "image" (opsional kalau pakai URL).
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refetch biar dapet data lengkap (category_name, tags, dll) hasil JOIN dari backend
      await dispatch(fetchProducts());
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menambahkan produk",
      );
    }
  },
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchProducts());
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memperbarui produk",
      );
    }
  },
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menghapus produk",
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  detail: {
    data: null,
    status: "idle",
    error: null,
  },
  filters: { search: "", category: "Semua Kategori" },
  pagination: { currentPage: 1, itemsPerPage: 10 },
  mutationStatus: "idle", // idle | loading | succeeded | failed — dipakai bareng buat create/edit/delete
  mutationError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    updateStock: (state, action) => {
      const { id, stock } = action.payload;

      const product = state.items.find((p) => p.id === id);

      if (product) {
        product.stock = stock;
      }
    },

    clearProductDetail: (state) => {
      state.detail = { data: null, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detail.status = "loading";
        state.detail.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detail.status = "succeeded";
        state.detail.data = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detail.status = "failed";
        state.detail.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.mutationError = action.payload;
      });
  },
});

export const { setFilters, setPage, updateStock, clearProductDetail } =
  productSlice.actions;

export default productSlice.reducer;
