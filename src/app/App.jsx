import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Toaster } from "react-hot-toast";
import { router } from "@/router/index";
import { store, persistor } from "@/app/store";
import "@/index.css";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}
