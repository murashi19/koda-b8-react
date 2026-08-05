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

// components
import Sidebar from "@/features/admin/components/AdminSidebar";
import Header from "@/features/admin/components/AdminHeader";

// Static Data
import { stats } from "@/features/admin/data/staticData";

// redux
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/features/admin/dashboardSlice";

const recentOrders = [
  {
    id: "#BM98765432",
    name: "Budi Santoso",
    date: "28 Mei 2026",
    price: "Rp 900.000",
  },
  {
    id: "#BM87654321",
    name: "Siti Rahayu",
    date: "28 Mei 2026",
    price: "Rp 450.000",
  },
  {
    id: "#BM76543210",
    name: "Ahmad Maulana",
    date: "27 Mei 2026",
    price: "Rp 1.250.000",
  },
];

const topProducts = [
  { name: "Headphone Wireless Premium", revenue: "Rp 70.200.000" },
  { name: 'Laptop Ultrabook Pro 15"', revenue: "Rp 739.500.000" },
  { name: "Kaos Polos Premium Cotton", revenue: "Rp 39.000.000" },
];

const categories = [
  { label: "Elektronik", pct: "45%", color: "bg-primary" },
  { label: "Fashion", pct: "28%", color: "bg-orange-500" },
  { label: "Rumah & Dapur", pct: "15%", color: "bg-success" },
  { label: "Kecantikan", pct: "8%", color: "bg-purple-500" },
  { label: "Lainnya", pct: "4%", color: "bg-secondary" },
];

// Custom tooltip untuk chart
const ChartTooltip = ({ active, payload, label }) => {
<<<<<<< HEAD
	if (!active || !payload?.length) return null;
	return (
		<div className='bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm'>
			<p className='font-semibold text-gray-700 mb-1'>{label}</p>
			<p className='text-blue-600'>Pendapatan: Rp {(payload[0]?.value / 1_000_000).toFixed(0)} jt</p>
			<p className='text-orange-500'>Pesanan: {payload[1]?.value}</p>
		</div>
	);
};

export default function AdminDashboard() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { sidebarOpen, revenueData } = useSelector((state) => state.dashboard);
	console.log(sidebarOpen);
	return (
		<div className='flex min-h-screen bg-[#f8fafc] font-sans text-[#1e293b]'>
			{/* Sidebar */}
			<Sidebar className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-[#07122a] text-white flex flex-col transition-all duration-300 shrink-0`} />

			{/* Main */}
			<div className='flex flex-col flex-1 min-w-0'>
				<Header
					onToggleSidebar={() => dispatch(toggleSidebar())}
					onSearch={(query) => console.log("search:", query)}
				/>

				<main className='p-8 flex flex-col gap-6 overflow-auto'>
					{/* Page Title */}
					<div className='flex items-start justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
							<p className='text-slate-500 mt-1.5'>Selamat datang kembali! Ini ringkasan bisnis hari ini.</p>
						</div>
						<time className='text-sm text-gray-500 mt-1'>28 Mei 2026</time>
					</div>

					{/* Stats Cards — PERBAIKAN ICON */}
					<div className='grid grid-cols-4 gap-5'>
						{stats.map((s) => (
							<div
								key={s.label}
								className='bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-1'>
								<div className='flex items-center justify-between text-sm text-slate-500'>
									<span>{s.label}</span>
									{/* ✅ Render icon sebagai komponen dengan size & color props */}
									<div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
										<s.icon
											size={18}
											color={s.iconColor}
										/>
									</div>
								</div>
								<h2 className='text-2xl font-bold text-gray-900 my-2'>{s.value}</h2>
								<small className={`text-xs ${s.trend === "up" ? "text-green-600" : "text-red-600"}`}>{s.change}</small>
							</div>
						))}
					</div>

					{/* Analytics */}
					<div className='grid grid-cols-3 gap-6'>
						{/* ✅ Area Chart dengan Recharts */}
						<div className='col-span-2 bg-white border border-slate-200 rounded-2xl p-6'>
							<div className='flex items-center justify-between mb-6'>
								<h3 className='font-semibold text-gray-900'>Pendapatan & Pesanan (2026)</h3>
								<button className='text-xs text-gray-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors'>12 Bulan Terakhir</button>
							</div>
							<ResponsiveContainer
								width='100%'
								height={320}>
								<AreaChart
									data={revenueData}
									margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
									<defs>
										<linearGradient
											id='colorRevenue'
											x1='0'
											y1='0'
											x2='0'
											y2='1'>
											<stop
												offset='5%'
												stopColor='#1a73e8'
												stopOpacity={0.15}
											/>
											<stop
												offset='95%'
												stopColor='#1a73e8'
												stopOpacity={0}
											/>
										</linearGradient>
										<linearGradient
											id='colorOrders'
											x1='0'
											y1='0'
											x2='0'
											y2='1'>
											<stop
												offset='5%'
												stopColor='#f97316'
												stopOpacity={0.15}
											/>
											<stop
												offset='95%'
												stopColor='#f97316'
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray='3 3'
										stroke='#f1f5f9'
									/>
									<XAxis
										dataKey='month'
										tick={{ fontSize: 12, fill: "#94a3b8" }}
										axisLine={false}
										tickLine={false}
									/>
									<YAxis
										yAxisId='revenue'
										orientation='left'
										tickFormatter={(v) => `${v / 1_000_000}jt`}
										tick={{ fontSize: 11, fill: "#94a3b8" }}
										axisLine={false}
										tickLine={false}
										width={48}
									/>
									<YAxis
										yAxisId='orders'
										orientation='right'
										tick={{ fontSize: 11, fill: "#94a3b8" }}
										axisLine={false}
										tickLine={false}
										width={36}
									/>
									<Tooltip content={<ChartTooltip />} />
									<Legend
										iconType='circle'
										iconSize={8}
										formatter={(value) => (value === "revenue" ? "Pendapatan" : "Pesanan")}
										wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
									/>
									<Area
										yAxisId='revenue'
										type='monotone'
										dataKey='revenue'
										stroke='#1a73e8'
										strokeWidth={2}
										fill='url(#colorRevenue)'
										dot={false}
										activeDot={{ r: 5 }}
									/>
									<Area
										yAxisId='orders'
										type='monotone'
										dataKey='orders'
										stroke='#f97316'
										strokeWidth={2}
										fill='url(#colorOrders)'
										dot={false}
										activeDot={{ r: 5 }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>

						{/* Category donut — tidak berubah */}
						<div className='bg-white border border-slate-200 rounded-2xl p-6'>
							<h3 className='font-semibold text-gray-900 mb-4'>Penjualan per Kategori</h3>
							<div
								className='w-45 h-45 rounded-full mx-auto my-5'
								style={{
									background: "conic-gradient(#2563eb 0 45%, #f97316 45% 73%, #22c55e 73% 88%, #8b5cf6 88% 96%, #64748b 96% 100%)",
								}}
							/>
							<ul className='flex flex-col gap-1 mt-2'>
								{categories.map((c) => (
									<li
										key={c.label}
										className='flex items-center justify-between py-2 border-b border-slate-100 last:border-0'>
										<div className='flex items-center gap-2'>
											<span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
											<span className='text-sm text-slate-600'>{c.label}</span>
										</div>
										<strong className='text-sm font-semibold text-gray-900'>{c.pct}</strong>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Bottom tables — tidak berubah */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='bg-white border border-slate-200 rounded-2xl p-6'>
							<div className='flex items-center justify-between mb-6'>
								<h3 className='font-semibold text-gray-900'>Pesanan Terbaru</h3>
								<button
									onClick={() => navigate("/admin/orders")}
									className='text-xs text-[#1a73e8] hover:underline'>
									Lihat Semua
								</button>
							</div>
							<ul className='flex flex-col'>
								{recentOrders.map((o) => (
									<li
										key={o.id}
										className='flex items-center justify-between py-4 border-b border-slate-100 last:border-0'>
										<div>
											<p className='text-sm font-semibold text-gray-900'>{o.id}</p>
											<p className='text-xs text-slate-500 mt-0.5'>
												{o.name} · {o.date}
											</p>
										</div>
										<span className='text-sm font-semibold text-blue-600'>{o.price}</span>
									</li>
								))}
							</ul>
						</div>

						<div className='bg-white border border-slate-200 rounded-2xl p-6'>
							<div className='flex items-center justify-between mb-6'>
								<h3 className='font-semibold text-gray-900'>Produk Terlaris</h3>
								<button
									onClick={() => navigate("/admin/products")}
									className='text-xs text-[#1a73e8] hover:underline'>
									Kelola
								</button>
							</div>
							<ul className='flex flex-col'>
								{topProducts.map((p, i) => (
									<li
										key={i}
										className='flex items-center justify-between py-4 border-b border-slate-100 last:border-0'>
										<span className='text-sm text-slate-700'>{p.name}</span>
										<strong className='text-sm font-semibold text-gray-900'>{p.revenue}</strong>
									</li>
								))}
							</ul>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
=======
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-sm shadow-lg p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      <p className="text-primary">
        Pendapatan: Rp {(payload[0]?.value / 1_000_000).toFixed(0)} jt
      </p>
      <p className="text-accent">Pesanan: {payload[1]?.value}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, revenueData } = useSelector((state) => state.dashboard);
  console.log(sidebarOpen);
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

        <main className="p-8 flex flex-col gap-6 overflow-auto">
          {/* Page Title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Dashboard
              </h1>
              <p className="text-text-secondary mt-1.5">
                Selamat datang kembali! Ini ringkasan bisnis hari ini.
              </p>
            </div>
            <time className="text-sm text-text-secondary mt-1">
              28 Mei 2026
            </time>
          </div>

          {/* Stats Cards — PERBAIKAN ICON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-base shadow-sm p-6 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>{s.label}</span>
                  {/* ✅ Render icon sebagai komponen dengan size & color props */}
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
                  className={`text-xs ${s.trend === "up" ? "text-success" : "text-red-600"}`}
                >
                  {s.change}
                </small>
              </div>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ✅ Area Chart dengan Recharts */}
            <div className="col-span-2 card-base shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-text-primary">
                  Pendapatan & Pesanan (2026)
                </h3>
                <button className="text-xs text-text-secondary border border-border rounded-lg px-3 py-1.5 hover:bg-surface transition-colors">
                  12 Bulan Terakhir
                </button>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={revenueData}
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
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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

            {/* Category donut — tidak berubah */}
            <div className="card-base shadow-sm p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Penjualan per Kategori
              </h3>
              <div
                className="w-45 h-45 rounded-full mx-auto my-5"
                style={{
                  background:
                    "conic-gradient(#2563eb 0 45%, #f97316 45% 73%, #22c55e 73% 88%, #8b5cf6 88% 96%, #64748b 96% 100%)",
                }}
              />
              <ul className="flex flex-col gap-1 mt-2">
                {categories.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className="text-sm text-text-secondary">
                        {c.label}
                      </span>
                    </div>
                    <strong className="text-sm font-semibold text-text-primary">
                      {c.pct}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom tables — tidak berubah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-base shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-text-primary">
                  Pesanan Terbaru
                </h3>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className="text-xs text-primary hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <ul className="flex flex-col">
                {recentOrders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between py-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {o.id}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {o.name} · {o.date}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {o.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-base shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-text-primary">
                  Produk Terlaris
                </h3>
                <button
                  onClick={() => navigate("/admin/products")}
                  className="text-xs text-primary hover:underline"
                >
                  Kelola
                </button>
              </div>
              <ul className="flex flex-col">
                {topProducts.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-4 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-text-primary">{p.name}</span>
                    <strong className="text-sm font-semibold text-text-primary">
                      {p.revenue}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
>>>>>>> feat/newVersion
}
