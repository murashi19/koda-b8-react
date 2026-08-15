import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// react-icons
import { FiSearch, FiEye, FiMail, FiX } from "react-icons/fi";
import { LuUsers, LuTrendingUp, LuShoppingBag } from "react-icons/lu";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";

import { fetchCustomers, setPage } from "@/features/admin/customersSlice";
import { toggleSidebar } from "@/features/admin/dashboardSlice";
import { getFullImageUrl } from "@/lib/imageUrl";

// Yup Schema
const searchSchema = yup.object({
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const getInitials = (name) =>
  (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Detail Modal
function CustomerDetailModal({ customer, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            Detail Pelanggan
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiX className="text-[18px] text-text-secondary" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {getFullImageUrl(customer.avatar) ? (
            <img
              src={getFullImageUrl(customer.avatar)}
              alt={customer.name}
              className="w-14 h-14 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-light text-primary text-base font-semibold flex items-center justify-center shrink-0">
              {getInitials(customer.name)}
            </div>
          )}
          <div>
            <p className="font-semibold text-text-primary">{customer.name}</p>
            <p className="text-sm text-text-secondary">{customer.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary text-xs mb-0.5">No. Telepon</p>
            <p className="text-text-primary font-medium">
              {customer.phone || "-"}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Kota</p>
            <p className="text-text-primary font-medium">{customer.city}</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Bergabung</p>
            <p className="text-text-primary font-medium">{customer.joinDate}</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Status Akun</p>
            <p className="text-text-primary font-medium">
              {customer.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
              {!customer.isActive && " • Nonaktif"}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Total Pesanan</p>
            <p className="text-text-primary font-medium">
              {customer.totalOrders}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Total Belanja</p>
            <p className="text-primary font-semibold">
              {customer.totalSpendingFormatted}
            </p>
          </div>
        </div>

        <a
          href={`mailto:${customer.email}`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white btn-accent rounded-xl transition-colors cursor-pointer"
        >
          <FiMail className="text-[15px]" />
          Kirim Email
        </a>
      </div>
    </div>
  );
}

// Main Page
export default function CustomerList() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.dashboard);
  const {
    items: customers,
    status,
    stats,
    pagination,
  } = useSelector((state) => state.customers);

  const [detailTarget, setDetailTarget] = useState(null);

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

  // reset ke halaman 1 tiap kali pencarian berubah
  useEffect(() => {
    if (currentPage !== 1) {
      dispatch(setPage(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // fetch (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);
      if (searchQuery.trim()) {
        params.set("search[name]", searchQuery.trim());
      }
      dispatch(fetchCustomers(params.toString()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, currentPage, itemsPerPage, searchQuery]);

  const summaryCards = [
    {
      icon: LuUsers,
      iconBg: "bg-success-light",
      iconColor: "text-success",
      value: stats.total_customers,
      label: "Total Pelanggan",
    },
    {
      icon: LuTrendingUp,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
      value: stats.new_this_month,
      label: "Pelanggan Baru (Bulan Ini)",
    },
    {
      icon: LuShoppingBag,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      value: Number(stats.avg_orders || 0).toFixed(1),
      label: "Rata-rata Pesanan / Pelanggan",
    },
  ];

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
          <h1 className="text-3xl font-bold text-text-primary">
            Manajemen Pelanggan
          </h1>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {summaryCards.map((s) => (
              <article key={s.label} className="p-6 card-base shadow-sm">
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full ${s.iconBg} mb-3`}
                >
                  <s.icon className={`text-[18px] ${s.iconColor}`} />
                </div>
                <h2 className="text-3xl font-bold mb-2">{s.value}</h2>
                <p className="text-sm text-text-secondary">{s.label}</p>
              </article>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1 p-4 card-base shadow-sm">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[15px]" />
              <input
                {...register("query")}
                type="text"
                placeholder="Cari nama atau email..."
                className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-text-primary bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
              />
            </div>
            {errors.query && (
              <p className="text-xs text-red-500 ml-1">
                {errors.query.message}
              </p>
            )}
          </div>

          {/* Table */}
          <div className="card-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 font-semibold text-text-primary border-b border-border">
              {pagination.totalItems} Pelanggan
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-surface">
                  <tr>
                    {[
                      "Pelanggan",
                      "Kota",
                      "Bergabung",
                      "Total Pesanan",
                      "Total Belanja",
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
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Memuat pelanggan...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada pelanggan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        {/* Profile */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {getFullImageUrl(c.avatar) ? (
                              <img
                                src={getFullImageUrl(c.avatar)}
                                alt={c.name}
                                className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-light text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                                {getInitials(c.name)}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <strong className="font-medium text-text-primary">
                                {c.name}
                              </strong>
                              <small className="text-text-secondary text-[13px]">
                                {c.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* City */}
                        <td className="px-4 py-4 text-text-primary">
                          {c.city}
                        </td>

                        {/* Join Date */}
                        <td className="px-4 py-4 text-text-primary">
                          {c.joinDate}
                        </td>

                        {/* Total Orders */}
                        <td className="px-4 py-4 text-text-primary">
                          {c.totalOrders}
                        </td>

                        {/* Total Spending */}
                        <td className="px-4 py-4 font-medium text-primary">
                          {c.totalSpendingFormatted}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1.25 text-xs font-medium rounded-full ${
                              c.isVerified
                                ? "bg-success-light text-success"
                                : "bg-surface text-text-secondary"
                            }`}
                          >
                            {c.isVerified
                              ? "Terverifikasi"
                              : "Belum Verifikasi"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDetailTarget(c)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
                              title="Lihat"
                            >
                              <FiEye className="text-[15px] text-text-secondary" />
                            </button>
                            <a
                              href={`mailto:${c.email}`}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                              title="Kirim Email"
                            >
                              <FiMail className="text-[15px] text-primary" />
                            </a>
                          </div>
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
                  {customers.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-text-primary">
                  {pagination.totalItems}
                </span>{" "}
                pelanggan
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => dispatch(setPage(pagination.currentPage - 1))}
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
                  onClick={() => dispatch(setPage(pagination.currentPage + 1))}
                  className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {detailTarget && (
        <CustomerDetailModal
          customer={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  );
}
