import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  ShoppingCart,
  Heart,
  TextAlignJustify,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import useCart from "@/features/cart/useCart";
import useWishlist from "@/features/wishlist/useWishlist";

import LogoHeader from "@/assets/logo-header.png";
import { useSelector } from "react-redux";

function MainHeader() {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { cart, cartStatus, loadCart } = useCart();
  const { wishlist, status: wishlistStatus, loadWishlist } = useWishlist();

  const isLoggedIn = auth && token;

  // Load wishlist from backend once per session after login
  useEffect(() => {
    if (isLoggedIn && wishlistStatus === "idle") {
      loadWishlist();
    }
  }, [isLoggedIn, loadWishlist, wishlistStatus]);

  // Load cart from backend once per session after login
  useEffect(() => {
    if (isLoggedIn && cartStatus === "idle") {
      loadCart();
    }
  }, [isLoggedIn, cartStatus, loadCart]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (value) {
      navigate(`/browse-product?q=${encodeURIComponent(value)}`);
    }
  };

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <div className="w-full bg-white">
      <div className="container-page flex items-center justify-between gap-6 py-4 px-4 xl:px-0">
        {/* LOGO */}
        <Link className="shrink-0 flex items-center cursor-pointer" to="/">
          <img className="w-32 md:w-38" src={LogoHeader} alt="Logo BeliMudah" />
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <form
            id="search-bar"
            onSubmit={handleSearch}
            className="w-full flex items-center border border-border rounded-full bg-surface focus-within:border-primary transition-colors duration-300"
          >
            <input
              className="w-full py-2.5 px-5 rounded-l-full bg-transparent outline-hidden text-sm text-text-primary placeholder:text-text-secondary"
              type="text"
              placeholder="Cari produk, merek, kategori..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-primary text-white rounded-full m-0.5 hover:bg-primary-dark transition-colors duration-300 cursor-pointer"
              type="submit"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Notification */}
          <button
            onClick={() => navigate("/")}
            className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-primary-light transition-colors duration-300 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* User — kondisional */}
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/profile/edit-profile")}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary-light hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span
                id="user-name"
                className="hidden lg:block text-sm font-medium"
              >
                {auth.full_name}
              </span>
            </button>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all duration-300 cursor-pointer
                ${dropdownOpen ? "bg-primary-light text-primary border-primary/30" : "border-border hover:border-primary/40 hover:bg-primary-light hover:text-primary"}`}
              >
                <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-sm font-medium hidden lg:block">
                  Akun
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-primary" : "text-text-secondary"}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  {/* Login */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate("/auth/login");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors duration-300 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Masuk
                    </button>
                  </div>

                  <div className="px-4 pb-1">
                    <div className="flex items-center gap-2">
                      <hr className="flex-1 border-border" />
                      <span className="text-[11px] text-text-secondary">
                        atau
                      </span>
                      <hr className="flex-1 border-border" />
                    </div>
                  </div>

                  {/* Register */}
                  <div className="px-2 pb-2">
                    <button
                      onClick={() => {
                        navigate("/auth/register");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary bg-primary-light hover:bg-primary/10 transition-colors duration-300 cursor-pointer"
                    >
                      <span className="w-4 h-4 flex items-center justify-center rounded-full border border-primary/50 text-[10px] font-bold">
                        +
                      </span>
                      Daftar Sekarang
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => navigate("/profile/wishlist")}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-light transition-colors duration-300 cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-medium leading-none">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            id="cart-icon"
            onClick={() => navigate("/cart")}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-primary-light transition-colors duration-300 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-medium leading-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu — 768px */}
          <button
            id="all-icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex md:hidden w-10 h-10 items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-primary-light transition-colors duration-300 cursor-pointer"
          >
            <TextAlignJustify className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile search + menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 flex flex-col gap-4">
          <form
            onSubmit={handleSearch}
            className="w-full flex items-center border border-border rounded-full bg-surface"
          >
            <input
              className="w-full py-2.5 px-5 rounded-l-full bg-transparent outline-hidden text-sm"
              type="text"
              placeholder="Cari produk..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-primary text-white rounded-full m-0.5"
              type="submit"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-3 text-sm text-text-secondary">
            <Link
              to="/browse-product"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-text-primary"
            >
              Semua Kategori
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile/edit-profile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profil Saya
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export default MainHeader;
