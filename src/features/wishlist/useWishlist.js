import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist as removeFromWishlistAction,
} from "@/features/wishlist/wishlistSlice";
import { showLoginModal } from "@/features/modal/modalSlice";

export default function useWishlist() {
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items);
  const status = useSelector((state) => state.wishlist.status);
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

    if (isWishlisted(product.id)) {
      dispatch(removeFromWishlistAction(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
    return true;
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;
    dispatch(removeFromWishlistAction(productId));
  };

  const loadWishlist = () => {
    if (!user) return;
    dispatch(fetchWishlist());
  };

  return {
    wishlist,
    status,
    toggleWishlist,
    removeFromWishlist,
    isWishlisted,
    loadWishlist,
  };
}
