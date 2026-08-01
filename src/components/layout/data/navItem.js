import {
    FaShoppingBag,
    FaHeart,
    FaMapMarkerAlt,
    FaCreditCard,
} from "react-icons/fa";

import { IoSettingsOutline } from "react-icons/io5";

export const navItems = [
    { id: "orders", icon: FaShoppingBag, label: "Pesanan saya", color: "text-[#1a73e8]", route: "/profile/my-orders" },
    { id: "wishlist", icon: FaHeart, label: "Wishlist", color: "text-gray-500", route: "/profile/wishlist" },
    { id: "address", icon: FaMapMarkerAlt, label: "Alamat Saya", color: "text-gray-500", route: "/profile/address-list" },
    { id: "payment", icon: FaCreditCard, label: "Metode Pembayaran", color: "text-gray-500", route: "/profile/payment" },
    { id: "settings", icon: IoSettingsOutline, label: "Pengaturan Profile", color: "text-gray-500", route: "/profile/edit-profile" },
];