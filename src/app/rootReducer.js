import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";

import modal from "@/features/modal/modalSlice";
import auth from "@/features/auth/authSlice";
import orders from "@/features/orders/ordersSlice";
import products from "@/features/products/productsSlice";
import dashboard from "@/features/admin/dashboardSlice";
import addresses from "@/features/address/addressSlice";
import wishlist from "@/features/wishlist/wishlistSlice";
import cart from "@/features/cart/cartSlice";

const rootReducer = combineReducers({
  auth,
  orders,
  products,
  dashboard,
  modal,
  addresses,
  wishlist,
  cart,
});

const persistConfig = {
  key: "belimudah",
  storage,
  whitelist: ["auth", "dashboard", "orders", "addresses", "wishlist", "cart"],
};

export default persistReducer(persistConfig, rootReducer);
