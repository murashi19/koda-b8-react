import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import { RiFilter3Line } from "react-icons/ri";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";

import { toggleSidebar } from "@/features/admin/dashboardSlice";
import {
  fetchAllOrdersAdmin,
  fetchOrderDetailAdmin,
  adminUpdateOrderStatus,
  ORDER_STATUS_LABELS,
} from "@/features/orders/ordersSlice";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/data/paymentMethods";
import { SHIPPING_METHOD_LABELS } from "@/features/checkout/data/shippingMethods";

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

const statusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-600" },
  PAID: { bg: "bg-primary-light", text: "text-primary" },
  PROCESSING: { bg: "bg-indigo-100", text: "text-indigo-600" },
  SHIPPED: { bg: "bg-indigo-100", text: "text-indigo-600" },
  DELIVERED: { bg: "bg-success-light", text: "text-success" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-600" },
};

// Urutan status "maju" yang wajar buat dropdown ganti status di tabel
const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Modal detail pesanan
function OrderDetailModal({ orderId, onClose }) {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.detailsById[orderId]);
  const detailStatus = useSelector(
    (state) => state.orders.detailStatusById[orderId],
  );

  useEffect(() => {
    if (!order) dispatch(fetchOrderDetailAdmin(orderId));
  }, [orderId, order, dispatch]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <header className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">
            Detail Pesanan {order ? `#${order.orderCode}` : ""}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiX className="text-[18px] text-text-secondary" />
          </button>
        </header>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto text-sm">
          {detailStatus === "loading" && !order && (
            <p className="text-text-secondary text-center py-8">Memuat...</p>
          )}
          {detailStatus === "failed" && !order && (
            <p className="text-red-500 text-center py-8">
              Gagal memuat detail pesanan.
            </p>
          )}
          {order && (
            <>
              <div>
                <p className="font-semibold text-text-primary">
                  {order.customerName}
                </p>
                <p className="text-text-secondary text-xs">
                  {order.customerEmail}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Tanggal</p>
                  <p className="text-text-primary">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Pengiriman</p>
                  <p className="text-text-primary">
                    {SHIPPING_METHOD_LABELS[order.shippingMethod] ??
                      order.shippingMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Pembayaran</p>
                  <p className="text-text-primary">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Status</p>
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${(statusConfig[order.status] ?? statusConfig.PENDING).bg} ${(statusConfig[order.status] ?? statusConfig.PENDING).text}`}
                  >
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>

              {order.address && (
                <div>
                  <p className="text-xs text-text-secondary mb-1">
                    Alamat Pengiriman
                  </p>
                  <p className="text-text-primary">
                    {order.address.detail}
                    {order.address.subdistrict
                      ? `, ${order.address.subdistrict}`
                      : ""}
                    {order.address.district
                      ? `, ${order.address.district}`
                      : ""}
                    {`, ${order.address.city}, ${order.address.province}`}
                    {order.address.postalCode
                      ? ` ${order.address.postalCode}`
                      : ""}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-text-secondary mb-2">Item Pesanan</p>
                <ul className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b border-border last:border-0 pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                        <div>
                          <p className="text-text-primary">{item.name}</p>
                          <p className="text-xs text-text-secondary">
                            {item.qty} x {formatRp(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-text-primary">
                        {formatRp(item.subtotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between pt-2 border-t border-border font-semibold text-text-primary">
                <span>Total</span>
                <span className="text-primary">{formatRp(order.total)}</span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Main Page
export default function OrderList() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.dashboard);
  const { adminOrders: orders, adminOrdersStatus: status } = useSelector(
    (state) => state.orders,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [viewOrderId, setViewOrderId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null); // id lagi diupdate

  useEffect(() => {
    if (status === "idle") dispatch(fetchAllOrdersAdmin());
  }, [status, dispatch]);

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
    const q = searchQuery.toLowerCase();
    const matchSearch =
      o.orderCode?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q);
    const matchTab = activeTab === "all" || o.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating(id);
    await dispatch(adminUpdateOrderStatus({ id, status: newStatus }));
    setStatusUpdating(null);
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
        <main className="p-8 flex flex-col gap-6 overflow-auto">
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
                {t.label} ({tabCounts[t.key] ?? 0})
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
                  {status === "loading" ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
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
                          #{o.orderCode}
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
