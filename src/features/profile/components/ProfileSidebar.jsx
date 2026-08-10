// src/components/ProfileSidebar.jsx
import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { navItems } from "@/components/layout/data/navItem";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { clearWishlistState } from "@/features/wishlist/wishlistSlice";
import { getFullImageUrl } from "@/lib/imageUrl";

function useProfileStats() {
  const orders = useSelector((state) => state.orders.orders);
  const wishlist = useSelector((state) => state.wishlist.items);

  const orderCount = orders?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  return { orderCount, wishlistCount };
}

export default function ProfileSidebar({ activeNav }) {
  const navigate = useNavigate();
  const { orderCount, wishlistCount } = useProfileStats();
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const character = auth?.full_name?.charAt(0).toUpperCase();
  const isAdmin = auth?.role === "ADMIN";
  const avatarUrl = getFullImageUrl(auth?.avatar);

  // Item dengan adminOnly: true cuma ditampilkan kalau user-nya admin
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleNav = (item) => {
    navigate(item.route);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlistState());
    navigate("/auth/login");
  };

  return (
    <div className="col-span-1 flex flex-col gap-4">
      {/* Avatar card */}
      <div className="flex flex-col items-center gap-3 card-base p-5 shadow-sm">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={auth?.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-primary">{character}</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-base font-semibold text-text-primary">
            {auth?.full_name}
          </h2>
          <span className="text-xs text-text-secondary">{auth?.email}</span>
        </div>
        <div className="w-full flex justify-center gap-6 pt-3 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-text-primary">
              {orderCount}
            </span>
            <span className="text-xs text-text-secondary">Pesanan</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-text-primary">
              {wishlistCount}
            </span>
            <span className="text-xs text-text-secondary">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Nav card */}
      <div className="flex flex-col card-base overflow-hidden shadow-sm">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              className={`flex items-center justify-between gap-3 px-5 py-4 transition-colors cursor-pointer ${isActive ? "bg-primary-light" : "bg-white hover:bg-surface"}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-text-secondary"}`}
                strokeWidth={2}
              />
              <span
                className={`flex-1 text-left text-base font-normal ${isActive ? "text-primary" : "text-text-secondary"}`}
              >
                {item.label}
              </span>
              <IoChevronForward
                className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-secondary"}`}
                strokeWidth={2}
              />
            </button>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 border-t border-border bg-white hover:bg-red-50 transition-colors cursor-pointer"
        >
          <FaSignOutAlt
            className="w-4 h-4 text-red-600 shrink-0"
            strokeWidth={2}
          />
          <span className="text-base font-normal text-red-600">Keluar</span>
        </button>
      </div>
    </div>
  );
}
