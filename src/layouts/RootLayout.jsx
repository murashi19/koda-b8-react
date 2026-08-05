import { Outlet } from "react-router-dom";
import LoginModal from "@/components/common/LoginModal";

export default function RootLayout() {
  return (
    <>
      <LoginModal />
      <Outlet />
    </>
  );
}
