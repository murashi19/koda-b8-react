import { configureStore } from "@reduxjs/toolkit";

import reducer from "@/app/rootReducer"
import persistStore from "redux-persist/es/persistStore";

export const store = configureStore({
    reducer,
    middleware: (getDefaulMiddleware) => {
        return getDefaulMiddleware({
            serializableCheck: false
        })
    }
});

export const persistor = persistStore(store);