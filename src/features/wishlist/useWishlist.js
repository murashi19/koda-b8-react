import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist as toggleWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist as clearWishlistAction,
} from "@/features/auth/authSlice";
import { showLoginModal } from "@/features/modal/modalSlice";

export default function useWishlist() {
  const user = useSelector((state) => state.auth.user);
  const wishlist = user?.wishlist ?? [];
  const dispatch = useDispatch();

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    if (!user) {
      dispatch(
        showLoginModal(
          "Silakan login terlebih dahulu untuk menyimpan produk ke wishlist.",
        ),
      );
      return false;
    }
    dispatch(toggleWishlistAction(product));
    return true;
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;
    dispatch(removeFromWishlistAction(productId));
  };

  const clearWishlist = () => {
    if (!user) return;
    dispatch(clearWishlistAction());
  };

  return {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    isWishlisted,
    clearWishlist,
  };
}
