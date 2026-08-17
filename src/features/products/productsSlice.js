import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function formatRupiah(value) {
  const number = Math.round(Number(value) || 0);
  return `Rp ${number.toLocaleString("id-ID")}`;
}

function mapTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        return tag;
      }
      return tag?.name;
    })
    .filter(Boolean);
}

export function mapProduct(p) {
  const regularPrice = Number(p.regular_price) || 0;

  const discountPrice =
    p.discount_price !== null &&
    p.discount_price !== undefined &&
    p.discount_price !== ""
      ? Number(p.discount_price)
      : null;

  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    image: p.image || null,
    category: p.category_name || p.category?.name || "",
    categoryId: p.category_id ?? null,
    regularPrice,
    discountPrice,
    regularPriceFormatted: formatRupiah(regularPrice),
    discountPriceFormatted:
      discountPrice !== null ? formatRupiah(discountPrice) : null,
    rating: Number(p.rating) || 0,
    review: p.review_count ?? p.review ?? 0,
    tags: mapTags(p.tags),
    stock: Number(p.stock) || 0,
    description: p.detail?.description ?? "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
  };
}

function mapProductDetail(p) {
  const product = mapProduct(p);
  return {
    ...product,
    description: p.detail?.description ?? "",
    specifications: p.detail?.specifications ?? "",
    images:
      Array.isArray(p.gallery) && p.gallery.length > 0
        ? p.gallery.map((image) => image.image_url || image)
        : p.images?.length
          ? p.images
          : p.image
            ? [p.image]
            : [],
  };
}

// GET ALL PRODUCTS
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (queryString = "", { rejectWithValue }) => {
    try {
      const url = queryString ? `/products?${queryString}` : "/products";
      const res = await api.get(url);
      return {
        items: (res.data.data || []).map(mapProduct),
        pagination: res.data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Gagal mengambil produk",
      );
    }
  },
);

// GET PRODUCT DETAIL
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return mapProductDetail(res.data.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil detail produk",
      );
    }
  },
);

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ formData, queryString = "" }, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(fetchProducts(queryString));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menambahkan produk",
      );
    }
  },
);

// UPDATE PRODUCT
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData, queryString = "" }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await dispatch(fetchProducts(queryString));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memperbarui produk",
      );
    }
  },
);

// DELETE PRODUCT
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

// INITIAL STATE
const initialState = {
  items: [],
  status: "idle",
  error: null,
  detail: {
    data: null,
    status: "idle",
    error: null,
  },
  filters: {
    search: "",
    category: "Semua Kategori",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  mutationStatus: "idle",
  mutationError: null,
};

// SLICE
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
      const product = state.items.find((p) => String(p.id) === String(id));
      if (product) {
        product.stock = stock;
      }
    },
    clearProductDetail: (state) => {
      state.detail = {
        data: null,
        status: "idle",
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
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
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // FETCH PRODUCT DETAIL
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
      // CREATE
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

      // UPDATE
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

      // DELETE
      .addCase(removeProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter(
          (p) => String(p.id) !== String(action.payload),
        );
        if (state.pagination.totalItems > 0) {
          state.pagination.totalItems -= 1;
        }
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const { setFilters, setPage, updateStock, clearProductDetail } =
  productSlice.actions;

export default productSlice.reducer;
