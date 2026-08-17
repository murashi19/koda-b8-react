// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";

// Layout
import RootLayout from "@/layouts/RootLayout";

// Guards
import { ProtectedRoute, AdminRoute } from "@/router/Guards";

// Auth
import Register from "@/pages/Auth/Register";
import Login from "@/pages/Auth/Login";
import ForgotPassword from "@/pages/Auth/ForgotPassword";

// Public
import LandingPage from "@/pages/LandingPage";
import BrowseProduct from "@/pages/BrowseProduct";
import DetailPage from "@/pages/DetailPage";

// Protected (customer)
import Cart from "@/pages/Cart";
import CheckOutLayout from "@/pages/CheckOutLayout";
import CheckoutStep1 from "@/pages/Checkout/Step1";
import CheckoutStep2 from "@/pages/Checkout/Step2";
import CheckoutStep3 from "@/pages/Checkout/Step3";
import CheckoutSuccess from "@/pages/Checkout/Success";
import MyOrder from "@/pages/Profile/MyOrder";
import Wishlist from "@/pages/Profile/Wishlist";
import AddressList from "@/pages/Profile/AddressList";
import PaymentMethods from "@/pages/Profile/PaymentMethods";
import EditProfile from "@/pages/Profile/EditProfile";

// Admin
import AdminDashboard from "@/pages/Admin/Dashboard";
import ProductList from "@/pages/Admin/ProductList";
import OrderList from "@/pages/Admin/OrderList";
import CustomerList from "@/pages/Admin/Customers";
import ErrorPage from "@/pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public
      { path: "/", element: <LandingPage /> },
      { path: "/browse-product", element: <BrowseProduct /> },
      { path: "/browse-product/:slug", element: <BrowseProduct /> },
      { path: "/detail-page/:id", element: <DetailPage /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },

      // Protected (harus login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: <Cart /> },
          { path: "/success", element: <CheckoutSuccess /> },
          {
            path: "/checkout",
            element: <CheckOutLayout />,
            children: [
              { path: "/checkout/step1", element: <CheckoutStep1 /> },
              { path: "/checkout/step2", element: <CheckoutStep2 /> },
              { path: "/checkout/step3", element: <CheckoutStep3 /> },
            ],
          },
          { path: "/profile/my-orders", element: <MyOrder /> },
          { path: "/profile/wishlist", element: <Wishlist /> },
          { path: "/profile/address-list", element: <AddressList /> },
          { path: "/profile/payment", element: <PaymentMethods /> },
          { path: "/profile/edit-profile", element: <EditProfile /> },
        ],
      },

      // Admin only
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/produk-list", element: <ProductList /> },
          { path: "/admin/order-list", element: <OrderList /> },
          { path: "/admin/customers", element: <CustomerList /> },
        ],
      },
      // 404
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
