import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/features/auth/useAuth";
import useModal from "@/features/modal/useModal";

export function ProtectedRoute() {
  const { auth } = useAuth();
  const { showLoginModal } = useModal();

  useEffect(() => {
    if (!auth) {
      showLoginModal(
        "Silakan login terlebih dahulu untuk mengakses halaman ini.",
      );
    }
  }, [auth, showLoginModal]);

  if (!auth) return <Navigate to="/" replace />;
  return <Outlet />;
}

// Untuk route admin - redirect langsung, tidak perlu modal
export function AdminRoute() {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/auth/login" replace />;
  if (auth.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
