import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartQty as updateCartQtyAction,
  clearCart as clearCartAction,
} from "@/features/auth/authSlice";
import { showLoginModal } from "@/features/modal/modalSlice";

export default function useCart() {
  const user = useSelector((state) => state.auth.user);
  const cart = user?.cart ?? [];
  const dispatch = useDispatch();

  const addToCart = (product, qty = 1) => {
    if (!user) {
      dispatch(
        showLoginModal(
          "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.",
        ),
      );
      return false;
    }
    dispatch(addToCartAction(product, qty));
    return true;
  };

  const removeFromCart = (productId) => {
    if (!user) return;
    dispatch(removeFromCartAction(productId));
  };

  const updateCartQty = (productId, qty) => {
    if (!user || qty < 1) return;
    dispatch(updateCartQtyAction(productId, qty));
  };

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const clearCart = () => {
    if (!user) return;
    dispatch(clearCartAction());
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    isInCart,
    clearCart,
  };
}
