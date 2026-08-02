import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction, updateUser } from "@/features/auth/authSlice";
import { placeOrder as placeOrderThunk } from "@/features/orders/ordersSlice";

export default function useAuth() {
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const setAuth = (user) => {
    if (!user) {
      dispatch(logoutAction());
    }
  };

  const updateAuth = (partialUpdate) => {
    dispatch(updateUser(partialUpdate));
  };

  const placeOrder = (orderData) => dispatch(placeOrderThunk(orderData));

  return { auth, setAuth, updateAuth, placeOrder };
}
