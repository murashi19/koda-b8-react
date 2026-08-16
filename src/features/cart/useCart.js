import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartQty as updateCartQtyThunk,
  clearCartLocal,
} from "@/features/cart/cartSlice";
import { showLoginModal } from "@/features/modal/modalSlice";

export default function useCart() {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const removingId = useSelector((state) => state.cart.removingId);
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
    dispatch(addToCartAction({ productId: product.id, qty }));
    return true;
  };

  const updateCartQty = (cartItemId, qty) => {
    if (!user || qty < 1) return;
    dispatch(updateCartQtyThunk({ cartItemId, qty }));
  };

  // cartItemId di sini = id row cart (item.id), bukan productId
  const removeFromCart = (cartItemId) => {
    if (!user) return;
    dispatch(removeFromCartAction(cartItemId));
  };

  const isInCart = (productId) =>
    cart.some((item) => item.productId === productId);

  const loadCart = () => {
    if (!user) return;
    dispatch(fetchCart());
  };

  const clearCart = () => {
    dispatch(clearCartLocal());
  };

  return {
    cart,
    cartStatus: status,
    removingId,
    addToCart,
    removeFromCart,
    updateCartQty,
    isInCart,
    loadCart,
    clearCart,
  };
}
