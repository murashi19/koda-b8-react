import { BsBoxSeam } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { LuTrendingUp } from "react-icons/lu"
import { HiUsers } from "react-icons/hi";

export const stats = [
	{
		label: "Total Pendapatan (Bulan Ini)",
		value: "Rp 125.000.000",
		change: "▲ 18.2% dari bulan lalu",
		trend: "up",
		iconBg: "bg-blue-100",
		iconColor: "#1a73e8",
		icon: LuTrendingUp,
	},
	{
		label: "Pesanan Baru",
		value: "890",
		change: "▲ 12.5% dari bulan lalu",
		trend: "up",
		iconBg: "bg-orange-100",
		iconColor: "#f97316",
		icon: FiShoppingCart,
	},
	{
		label: "Pelanggan Aktif",
		value: "3.284",
		change: "▲ 8.1% dari bulan lalu",
		trend: "up",
		iconBg: "bg-green-100",
		iconColor: "#16a34a",
		icon: HiUsers,
	},
	{
		label: "Produk Aktif",
		value: "247",
		change: "▼ 2.3% dari bulan lalu",
		trend: "down",
		iconBg: "bg-purple-100",
		iconColor: "#9333ea",
		icon: BsBoxSeam,
	},
];

export const revenueData = [
	{ month: "Jun", revenue: 78000000, orders: 540 },
	{ month: "Jul", revenue: 82000000, orders: 580 },
	{ month: "Agu", revenue: 91000000, orders: 610 },
	{ month: "Sep", revenue: 87000000, orders: 595 },
	{ month: "Okt", revenue: 95000000, orders: 650 },
	{ month: "Nov", revenue: 104000000, orders: 700 },
	{ month: "Des", revenue: 132000000, orders: 820 },
	{ month: "Jan", revenue: 99000000, orders: 690 },
	{ month: "Feb", revenue: 101000000, orders: 705 },
	{ month: "Mar", revenue: 108000000, orders: 740 },
	{ month: "Apr", revenue: 118000000, orders: 790 },
	{ month: "Mei", revenue: 125000000, orders: 890 },
];