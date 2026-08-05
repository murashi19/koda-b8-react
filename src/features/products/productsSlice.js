import { createSlice } from "@reduxjs/toolkit";
import { products } from "@/features/products/data/products";

const initialState = {
  items: products,
  filters: {
    search: "",
    category: "Semua Kategori",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
  },
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

    addProduct: (state, action) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    updateStock: (state, action) => {
      const { id, stock } = action.payload;

      const product = state.items.find((p) => p.id === id);

      if (product) {
        product.stock = stock;
      }
    },
  },
});

export const {
  setFilters,
  setPage,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = productSlice.actions;

export default productSlice.reducer;
