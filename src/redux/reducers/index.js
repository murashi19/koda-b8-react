// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";

import orders from "./orders.js";
import products from "./products.js";
import dashboard from "./dashboard.js";
import auth from "./auth.js";

const rootReducer = combineReducers({
  orders,
  products,
  dashboard,
  auth,
});

const persistConfig = {
  key: "admin",
  storage,
  whitelist: ["dashboard", "auth"],
};

export default persistReducer(persistConfig, rootReducer);
