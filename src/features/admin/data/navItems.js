// react-icons
import { MdDashboard, MdSettings } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";

export const navItems = [
    { id: "dashboard", icon: MdDashboard, label: "Dashboard", route: "/admin/dashboard" },
    { id: "products", icon: BsBoxSeam, label: "Produk", route: "/admin/produk-list" },
    { id: "orders", icon: FiShoppingCart, label: "Pesanan", route: "/admin/order-list" },
    { id: "customers", icon: HiUsers, label: "Pelanggan", route: "/admin/customers" },
    { id: "settings", icon: MdSettings, label: "Pengaturan", route: "/admin/settings" },
];