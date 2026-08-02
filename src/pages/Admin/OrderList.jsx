/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons
import { FiSearch, FiEye, FiCheck } from "react-icons/fi";
import { RiFilter3Line } from "react-icons/ri";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";

// Order actions
import { updateOrderStatus } from "@/features/orders/ordersSlice";

// Yup Schema
const searchSchema = yup.object({
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const tabs = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "packed", label: "Dikemas" },
  { key: "shipped", label: "Dikirim" },
  { key: "delivered", label: "Terkirim" },
];

const statusConfig = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-600" },
  packed: { label: "Dikemas", bg: "bg-primary-light", text: "text-primary" },
  shipped: { label: "Dikirim", bg: "bg-indigo-100", text: "text-indigo-600" },
  delivered: {
    label: "Terkirim",
    bg: "bg-success-light",
    text: "text-success",
  },
  cancelled: { label: "Dibatalkan", bg: "bg-red-100", text: "text-red-600" },
};

// Main Page
export default function OrderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const orders = useSelector((state) => state.orders.orders);
  const [activeTab, setActiveTab] = useState("all");

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const searchQuery = watch("query") ?? "";

  const tabCounts = tabs.reduce((acc, t) => {
    acc[t.key] =
      t.key === "all"
        ? orders.length
        : orders.filter((o) => o.status === t.key).length;
    return acc;
  }, {});

  // Filter logic
  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "all" || o.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleConfirm = (id) => {
    dispatch(updateOrderStatus({ id, status: "delivered" }));
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans text-secondary">
      <Sidebar
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-secondary text-white flex flex-col transition-all duration-300 shrink-0`}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onSearch={(query) => console.log("search:", query)}
        />

        {/* Content */}
        <main className="p-8 flex flex-col gap-6 overflow-auto">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">
              Manajemen Pesanan
            </h1>
            <button className="flex items-center gap-2 px-5 py-3 btn-accent text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
              Ekspor
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`h-11 px-4.5 rounded-xl border text-sm cursor-pointer transition-colors ${activeTab === t.key ? "bg-primary text-white border-primary" : "bg-white text-text-primary border-border hover:bg-surface"}`}
              >
                {t.label} ({tabCounts[t.key]})
              </button>
            ))}
          </div>

          {/* Toolbar — Search + Filter with RHF + Yup */}
          <div className="flex gap-4 p-4 card-base shadow-sm">
            {/* Search */}
            <div className="flex flex-col flex-1 gap-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[15px]" />
                <input
                  {...register("query")}
                  type="text"
                  placeholder="Cari nomor pesanan atau nama pelanggan..."
                  className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-text-primary bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
                />
              </div>
              {errors.query && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.query.message}
                </p>
              )}
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 h-12 px-4 border border-border rounded-xl bg-white text-sm text-text-primary hover:bg-surface transition-colors cursor-pointer">
              <RiFilter3Line className="text-[16px]" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="card-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 font-semibold text-text-primary border-b border-border">
              {filtered.length} Pesanan
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-surface">
                  <tr>
                    {[
                      "No. Pesanan",
                      "Pelanggan",
                      "Tanggal",
                      "Item",
                      "Total",
                      "Pembayaran",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada pesanan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr
                        key={o.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-4 py-4 text-primary font-semibold">
                          {o.orderId}
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <strong className="font-medium text-text-primary">
                              {o.customerName}
                            </strong>
                            <small className="text-text-secondary text-[13px]">
                              {o.customerEmail}
                            </small>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-text-primary">
                          {o.date}
                        </td>

                        {/* Items */}
                        <td className="px-4 py-4 text-text-primary">
                          {o.itemCount}
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4 text-primary font-medium">
                          {o.total}
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4 text-text-primary">
                          {o.payment}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full ${(statusConfig[o.status] ?? statusConfig.pending).bg} ${(statusConfig[o.status] ?? statusConfig.pending).text}`}
                          >
                            {
                              (statusConfig[o.status] ?? statusConfig.pending)
                                .label
                            }
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/orders/${o.id}`)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
                              title="Lihat"
                            >
                              <FiEye className="text-[15px] text-text-secondary" />
                            </button>
                            {o.status !== "delivered" &&
                              o.status !== "cancelled" && (
                                <button
                                  onClick={() => handleConfirm(o.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-success-light transition-colors cursor-pointer"
                                  title="Konfirmasi"
                                >
                                  <FiCheck className="text-[15px] text-success" />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
