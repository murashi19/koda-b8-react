import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useModal from "@/features/modal/useModal";
import { useSelector } from "react-redux";
import { hasRole } from "@/features/auth/roles";

export function ProtectedRoute() {
  const auth = useSelector((state) => state.auth.user);
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
  const auth = useSelector((state) => state.auth.user);
  if (!auth) return <Navigate to="/auth/login" replace />;
  if (!hasRole(auth, "ADMIN")) return <Navigate to="/" replace />;
  return <Outlet />;
}
