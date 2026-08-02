import { useDispatch, useSelector } from "react-redux";
import { showLoginModal, hideLoginModal } from "@/features/modal/modalSlice";

export default function useModal() {
  const modalVisible = useSelector((state) => state.modal.visible);
  const modalMessage = useSelector((state) => state.modal.message);
  const dispatch = useDispatch();

  return {
    modalVisible,
    modalMessage,
    showLoginModal: (message) => dispatch(showLoginModal(message)),
    hideLoginModal: () => dispatch(hideLoginModal()),
  };
}
