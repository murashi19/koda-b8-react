import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons
import { FiSearch, FiEye } from "react-icons/fi";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";

import { toggleSidebar } from "@/features/admin/dashboardSlice";
import {
  fetchAllOrdersAdmin,
  fetchOrderStatusCounts,
  adminUpdateOrderStatus,
  setAdminOrdersPage,
  ORDER_STATUS_LABELS,
} from "@/features/orders/ordersSlice";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/data/paymentMethods";
import OrderDetailModal from "./OrderDetail";

const formatRp = (n) => "Rp " + Number(n ?? 0).toLocaleString("id-ID");
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

// Yup Schema
const searchSchema = yup.object({
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const statusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-600" },
  PAID: { bg: "bg-primary-light", text: "text-primary" },
  PROCESSING: { bg: "bg-indigo-100", text: "text-indigo-600" },
  SHIPPED: { bg: "bg-indigo-100", text: "text-indigo-600" },
  DELIVERED: { bg: "bg-success-light", text: "text-success" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-600" },
};

// Tab & status sesuai enum order_status beneran di DB
const tabs = [
  { key: "all", label: "Semua" },
  { key: "PENDING", label: "Pending" },
  { key: "PAID", label: "Dibayar" },
  { key: "PROCESSING", label: "Diproses" },
  { key: "SHIPPED", label: "Dikirim" },
  { key: "DELIVERED", label: "Terkirim" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

// Urutan status "maju" yang wajar buat dropdown ganti status di tabel
const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Main Page
export default function OrderList() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.dashboard);
  const {
    adminOrders: orders,
    adminOrdersStatus: status,
    adminPagination: pagination,
    statusCounts,
  } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("all");
  const [viewOrderId, setViewOrderId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null); // id lagi diupdate

  const {
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const searchQuery = useWatch({ control, name: "query" }) ?? "";
  const currentPage = pagination.currentPage;
  const itemsPerPage = pagination.itemsPerPage;

  // Ambil angka count per status sekali di awal (dipakai buat badge di tab)
  useEffect(() => {
    dispatch(fetchOrderStatusCounts());
  }, [dispatch]);

  // reset ke halaman 1 tiap kali pencarian atau tab status berubah
  useEffect(() => {
    if (currentPage !== 1) {
      dispatch(setAdminOrdersPage(1));
    }
  }, [searchQuery, activeTab, currentPage, dispatch]);

  // fetch daftar order (debounced), server-side paging + search + filter status
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);
      params.set("sortBy", "created_at");
      params.set("sortOrder", "DESC");
      if (searchQuery.trim()) {
        params.set("search[keyword]", searchQuery.trim());
      }
      if (activeTab !== "all") {
        params.set("status", activeTab);
      }
      dispatch(fetchAllOrdersAdmin(params.toString()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, currentPage, itemsPerPage, searchQuery, activeTab]);

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating(id);
    await dispatch(adminUpdateOrderStatus({ id, status: newStatus }));
    setStatusUpdating(null);
    // status order berubah -> angka di badge tab ikut geser
    dispatch(fetchOrderStatusCounts());
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans text-secondary">
      <Sidebar
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-secondary text-white flex flex-col transition-all duration-300 shrink-0`}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          onToggleSidebar={() => dispatch(toggleSidebar())}
          onSearch={(query) => console.log("search:", query)}
        />

        {/* Content */}
        <main className="flex min-w-0 flex-col gap-6 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">
              Manajemen Pesanan
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`h-11 px-4.5 rounded-xl border text-sm cursor-pointer transition-colors ${activeTab === t.key ? "bg-primary text-white border-primary" : "bg-white text-text-primary border-border hover:bg-surface"}`}
              >
                {t.label} ({statusCounts[t.key] ?? 0})
              </button>
            ))}
          </div>

          {/* Toolbar — Search with RHF + Yup */}
          <div className="flex gap-4 p-4 card-base shadow-sm">
            {/* Search */}
            <div className="flex flex-col flex-1 gap-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[15px]" />
                <input
                  {...register("query")}
                  type="text"
                  placeholder="Cari nomor pesanan, nama, atau email pelanggan..."
                  className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-text-primary bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
                />
              </div>
              {errors.query && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.query.message}
                </p>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="card-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 font-semibold text-text-primary border-b border-border">
              {pagination.totalItems} Pesanan
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
                  {status === "loading" ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada pesanan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-4 py-4 text-primary font-semibold">
                          #{o.orderCode}
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <strong className="font-medium text-text-primary">
                              {o.customer?.full_name}
                            </strong>
                            <small className="text-text-secondary text-[13px]">
                              {o.customer?.email}
                            </small>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-text-primary">
                          {formatDate(o.createdAt)}
                        </td>

                        {/* Items */}
                        <td className="px-4 py-4 text-text-primary">
                          {o.itemCount}
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4 text-primary font-medium">
                          {formatRp(o.total)}
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4 text-text-primary">
                          {PAYMENT_METHOD_LABELS[o.paymentMethod] ??
                            o.paymentMethod}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <select
                            value={o.status}
                            disabled={statusUpdating === o.id}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value)
                            }
                            className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer disabled:opacity-60 ${(statusConfig[o.status] ?? statusConfig.PENDING).bg} ${(statusConfig[o.status] ?? statusConfig.PENDING).text}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABELS[s] ?? s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setViewOrderId(o.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
                            title="Lihat"
                          >
                            <FiEye className="text-[15px] text-text-secondary" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border">
              <p className="text-sm text-text-secondary">
                Menampilkan{" "}
                <span className="font-medium text-text-primary">
                  {orders.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-text-primary">
                  {pagination.totalItems}
                </span>{" "}
                pesanan
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    dispatch(setAdminOrdersPage(pagination.currentPage - 1))
                  }
                  className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
                >
                  Previous
                </button>

                <span className="px-3 py-2 text-sm">
                  {pagination.currentPage} / {pagination.totalPages || 1}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    dispatch(setAdminOrdersPage(pagination.currentPage + 1))
                  }
                  className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {viewOrderId && (
        <OrderDetailModal
          orderId={viewOrderId}
          onClose={() => setViewOrderId(null)}
        />
      )}
    </div>
  );
}
