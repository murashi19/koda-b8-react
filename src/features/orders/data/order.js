import Item1 from "@/assets/product1.png";
import Item2 from "@/assets/product2.png";
import Item3 from "@/assets/product3.png";
import Item4 from "@/assets/product4.png";
import Item5 from "@/assets/product5.jpg";

export const orders = [
  {
    id: "BM98765430",
    orderId: "#BM98765430",
    customerName: "Andi Wijaya",
    customerEmail: "andi.wijaya@email.com",
    date: "18 Mei 2026",
    status: "pending",
    payment: "GoPay",
    products: [
      {
        img: Item2,
        name: "Smartwatch Fitness Pro",
        qty: 1,
        price: "Rp 650.000",
      },
    ],
    total: "Rp 650.000",
    canReview: false,
  },
  {
    id: "BM98765431",
    orderId: "#BM98765431",
    customerName: "Dewi Lestari",
    customerEmail: "dewi.lestari@email.com",
    date: "19 Mei 2026",
    status: "packed",
    payment: "VA Mandiri",
    products: [
      {
        img: Item3,
        name: "Tas Selempang Kulit Asli",
        qty: 1,
        price: "Rp 320.000",
      },
    ],
    total: "Rp 320.000",
    canReview: false,
  },
  {
    id: "BM98765432",
    orderId: "#BM98765432",
    customerName: "Budi Santoso",
    customerEmail: "budi@email.com",
    date: "20 Mei 2026",
    status: "delivered",
    payment: "GoPay",
    products: [
      {
        img: Item1,
        name: "Headphone Wireless Premium",
        qty: 1,
        price: "Rp 450.000",
      },
    ],
    total: "Rp 450.000",
    canReview: true,
  },
  {
    id: "BM98765433",
    orderId: "#BM98765433",
    customerName: "Siti Rahayu",
    customerEmail: "siti@email.com",
    date: "26 Mei 2026",
    status: "shipped",
    payment: "VA BCA",
    products: [
      {
        img: Item5,
        name: "Kaos Polos Premium Cotton",
        qty: 2,
        price: "Rp 125.000",
      },
      {
        img: Item4,
        name: "Sneakers Sport Runfast",
        qty: 1,
        price: "Rp 550.000",
      },
    ],
    total: "Rp 800.000",
    canReview: false,
  },
  {
    id: "BM98765434",
    orderId: "#BM98765434",
    customerName: "Rina Marlina",
    customerEmail: "rina.marlina@email.com",
    date: "27 Mei 2026",
    status: "shipped",
    payment: "OVO",
    products: [
      {
        img: Item4,
        name: "Sneakers Sport Runfast",
        qty: 1,
        price: "Rp 550.000",
      },
    ],
    total: "Rp 550.000",
    canReview: false,
  },
  {
    id: "BM98765435",
    orderId: "#BM98765435",
    customerName: "Joko Prasetyo",
    customerEmail: "joko.prasetyo@email.com",
    date: "27 Mei 2026",
    status: "delivered",
    payment: "VA BNI",
    products: [
      {
        img: Item2,
        name: "Smartwatch Fitness Pro",
        qty: 1,
        price: "Rp 650.000",
      },
    ],
    total: "Rp 650.000",
    canReview: true,
  },
  {
    id: "BM98765436",
    orderId: "#BM98765436",
    customerName: "Maya Putri",
    customerEmail: "maya.putri@email.com",
    date: "28 Mei 2026",
    status: "cancelled",
    payment: "GoPay",
    products: [
      {
        img: Item3,
        name: "Tas Selempang Kulit Asli",
        qty: 1,
        price: "Rp 320.000",
      },
    ],
    total: "Rp 320.000",
    canReview: false,
  },
  {
    id: "BM98765437",
    orderId: "#BM98765437",
    customerName: "Agus Setiawan",
    customerEmail: "agus.setiawan@email.com",
    date: "28 Mei 2026",
    status: "delivered",
    payment: "VA BCA",
    products: [
      {
        img: Item5,
        name: "Kaos Polos Premium Cotton",
        qty: 3,
        price: "Rp 125.000",
      },
    ],
    total: "Rp 375.000",
    canReview: true,
  },
];

// Helper untuk dipakai admin table (jumlah item & total qty per pesanan)
export const ordersWithMeta = orders.map((o) => ({
  ...o,
  itemCount: o.products.reduce((sum, p) => sum + p.qty, 0),
}));

export const summaryCards = [
  { label: "Total Pesanan", value: orders.length },
  {
    label: "Pending",
    value: orders.filter((o) => o.status === "pending").length,
  },
  {
    label: "Dikirim",
    value: orders.filter((o) => o.status === "shipped").length,
  },
  {
    label: "Terkirim",
    value: orders.filter((o) => o.status === "delivered").length,
  },
];
