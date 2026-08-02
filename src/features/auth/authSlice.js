import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout(state) {
      state.user = null;
      state.token = null;
    },

    updateUser(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },

    // ---- Cart ----
    addToCart: {
      reducer(state, action) {
        if (!state.user) return;
        const { product, qty } = action.payload;
        const cart = state.user.cart ?? [];
        const existing = cart.find((item) => item.id === product.id);

        state.user.cart = existing
          ? cart.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + qty } : item,
            )
          : [...cart, { ...product, qty }];
      },
      prepare(product, qty = 1) {
        return { payload: { product, qty } };
      },
    },

    removeFromCart(state, action) {
      if (!state.user) return;
      const cart = state.user.cart ?? [];
      state.user.cart = cart.filter((item) => item.id !== action.payload);
    },

    updateCartQty: {
      reducer(state, action) {
        if (!state.user) return;
        const { productId, qty } = action.payload;
        if (qty < 1) return;
        const cart = state.user.cart ?? [];
        state.user.cart = cart.map((item) =>
          item.id === productId ? { ...item, qty } : item,
        );
      },
      prepare(productId, qty) {
        return { payload: { productId, qty } };
      },
    },

    clearCart(state) {
      if (!state.user) return;
      state.user.cart = [];
    },

    // ---- Wishlist ----
    toggleWishlist(state, action) {
      if (!state.user) return;
      const product = action.payload;
      const wishlist = state.user.wishlist ?? [];
      const isWishlisted = wishlist.some((item) => item.id === product.id);

      state.user.wishlist = isWishlisted
        ? wishlist.filter((item) => item.id !== product.id)
        : [...wishlist, product];
    },

    removeFromWishlist(state, action) {
      if (!state.user) return;
      const wishlist = state.user.wishlist ?? [];
      state.user.wishlist = wishlist.filter(
        (item) => item.id !== action.payload,
      );
    },

    clearWishlist(state) {
      if (!state.user) return;
      state.user.wishlist = [];
    },
  },
});

export const {
  login,
  logout,
  updateUser,
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = authSlice.actions;

export default authSlice.reducer;
