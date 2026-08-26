import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// react-icons
import { BsBoxSeam } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { LuTrendingUp } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";

// components
import Sidebar from "@/features/admin/components/AdminSidebar";
import Header from "@/features/admin/components/AdminHeader";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  fetchDashboardSummary,
} from "@/features/admin/dashboardSlice";

const formatRp = (n) => "Rp " + Number(n ?? 0).toLocaleString("id-ID");

const CATEGORY_PALETTE = [
  { hex: "#2563eb", cls: "bg-primary" },
  { hex: "#f97316", cls: "bg-orange-500" },
  { hex: "#22c55e", cls: "bg-success" },
  { hex: "#8b5cf6", cls: "bg-purple-500" },
  { hex: "#ec4899", cls: "bg-pink-500" },
  { hex: "#64748b", cls: "bg-secondary" },
];

function buildConicGradient(categories) {
  let cursor = 0;
  const stops = categories.map((c, i) => {
    const start = cursor;
    const end = cursor + c.pct;
    cursor = end;
    return `${CATEGORY_PALETTE[i % CATEGORY_PALETTE.length].hex} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function trendLabel(pct) {
  const rounded = Math.abs(pct).toFixed(1);
  return pct >= 0
    ? `▲ ${rounded}% dari bulan lalu`
    : `▼ ${rounded}% dari bulan lalu`;
}

// Custom tooltip untuk chart
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-sm p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      <p className="text-primary">
        Pendapatan: Rp {(payload[0]?.value / 1_000_000).toFixed(1)} jt
      </p>
      <p className="text-accent">Pesanan: {payload[1]?.value}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, summary, status } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (status === "idle") dispatch(fetchDashboardSummary());
  }, [status, dispatch]);

  const stats = summary
    ? [
        {
          label: "Total Pendapatan (Bulan Ini)",
          value: formatRp(summary.stats.revenueThisMonth),
          changePct: summary.stats.revenueChangePct,
          iconBg: "bg-blue-100",
          iconColor: "#1a73e8",
          icon: LuTrendingUp,
        },
        {
          label: "Pesanan Baru (Bulan Ini)",
          value: summary.stats.ordersThisMonth,
          changePct: summary.stats.ordersChangePct,
          iconBg: "bg-orange-100",
          iconColor: "#f97316",
          icon: FiShoppingCart,
        },
        {
          label: "Pelanggan Aktif (Bulan Ini)",
          value: summary.stats.activeCustomersThisMonth,
          changePct: summary.stats.customersChangePct,
          iconBg: "bg-green-100",
          iconColor: "#16a34a",
          icon: HiUsers,
        },
        {
          label: "Produk Aktif",
          value: summary.stats.activeProducts,
          changePct: summary.stats.productsChangePct,
          iconBg: "bg-purple-100",
          iconColor: "#9333ea",
          icon: BsBoxSeam,
        },
      ]
    : [];

  const categories = summary?.categoryBreakdown ?? [];
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-surface font-sans text-secondary">
      {/* Sidebar */}
      <Sidebar
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-secondary text-white flex flex-col transition-all duration-300 shrink-0`}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onToggleSidebar={() => dispatch(toggleSidebar())}
          onSearch={(query) => console.log("search:", query)}
        />

        <main className="flex min-w-0 flex-col gap-6 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Page Title */}
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Dashboard
              </h1>
              <p className="text-text-secondary mt-1.5">
                Selamat datang kembali! Ini ringkasan bisnis hari ini.
              </p>
            </div>
            <time className="shrink-0 text-sm text-text-secondary sm:mt-1">{today}</time>
          </div>

          {status === "loading" && !summary && (
            <div className="card-base shadow-sm p-8 text-center text-sm text-text-secondary">
              Memuat data dashboard...
            </div>
          )}

          {status === "failed" && !summary && (
            <div className="card-base shadow-sm p-8 text-center text-sm text-red-500">
              Gagal memuat data dashboard.
            </div>
          )}

          {summary && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="card-base shadow-sm p-6 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{s.label}</span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}
                      >
                        <s.icon size={18} color={s.iconColor} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary my-2">
                      {s.value}
                    </h2>
                    <small
                      className={`text-xs ${s.changePct >= 0 ? "text-success" : "text-red-600"}`}
                    >
                      {trendLabel(s.changePct)}
                    </small>
                  </div>
                ))}
              </div>

              {/* Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area Chart */}
                <div className="col-span-2 card-base shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-text-primary">
                      Pendapatan & Pesanan (12 Bulan Terakhir)
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart
                      data={summary.revenueByMonth}
                      margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorOrders"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f97316"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f97316"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="revenue"
                        orientation="left"
                        tickFormatter={(v) => `${v / 1_000_000}jt`}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <YAxis
                        yAxisId="orders"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) =>
                          value === "revenue" ? "Pendapatan" : "Pesanan"
                        }
                        wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                      />
                      <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                      <Area
                        yAxisId="orders"
                        type="monotone"
                        dataKey="orders"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#colorOrders)"
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category donut */}
                <div className="card-base shadow-sm p-6">
                  <h3 className="font-semibold text-text-primary mb-4">
                    Penjualan per Kategori
                  </h3>
                  {categories.length === 0 ||
                  categories.every((c) => c.pct === 0) ? (
                    <p className="text-sm text-text-secondary text-center py-10">
                      Belum ada penjualan.
                    </p>
                  ) : (
                    <>
                      <div
                        className="w-45 h-45 rounded-full mx-auto my-5"
                        style={{ background: buildConicGradient(categories) }}
                      />
                      <ul className="flex flex-col gap-1 mt-2">
                        {categories.map((c, i) => (
                          <li
                            key={c.label}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${CATEGORY_PALETTE[i % CATEGORY_PALETTE.length].cls}`}
                              />
                              <span className="text-sm text-text-secondary">
                                {c.label}
                              </span>
                            </div>
                            <strong className="text-sm font-semibold text-text-primary">
                              {c.pct.toFixed(1)}%
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-base shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-text-primary">
                      Pesanan Terbaru
                    </h3>
                    <button
                      onClick={() => navigate("/admin/order-list")}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  {summary.recentOrders.length === 0 ? (
                    <p className="text-sm text-text-secondary py-6 text-center">
                      Belum ada pesanan.
                    </p>
                  ) : (
                    <ul className="flex flex-col">
                      {summary.recentOrders.map((o) => (
                        <li
                          key={o.id}
                          className="flex items-center justify-between py-4 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm font-semibold text-text-primary">
                              #{o.orderCode}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              {o.customerName} ·{" "}
                              {new Date(o.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {formatRp(o.total)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="card-base shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-text-primary">
                      Produk Terlaris
                    </h3>
                    <button
                      onClick={() => navigate("/admin/produk-list")}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                  {summary.topProducts.length === 0 ? (
                    <p className="text-sm text-text-secondary py-6 text-center">
                      Belum ada penjualan produk.
                    </p>
                  ) : (
                    <ul className="flex flex-col">
                      {summary.topProducts.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between py-4 border-b border-border last:border-0"
                        >
                          <span className="text-sm text-text-primary">
                            {p.name}
                          </span>
                          <strong className="text-sm font-semibold text-text-primary">
                            {formatRp(p.revenue)}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
