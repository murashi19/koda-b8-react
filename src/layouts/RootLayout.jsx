import { Outlet } from "react-router-dom";
import LoginModal from "@/components/common/LoginModal";

export default function RootLayout() {
  return (
    <div className="min-w-0 max-w-full overflow-x-clip">
      <LoginModal />
      <Outlet />
    </div>
  );
}
