/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons
import { FiSearch, FiEye, FiMail } from "react-icons/fi";
import { LuUsers, LuTrendingUp, LuShoppingBag, LuStar } from "react-icons/lu";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";

// Customer Data
import {
  customers,
  customerStats,
  customerGrowth,
} from "@/features/admin/data/customers";
const customersData = [...customers];

// Yup Schema
const searchSchema = yup.object({
<<<<<<< HEAD
	query: yup
		.string()
		.trim()
		.max(100, "Pencarian maksimal 100 karakter")
		.matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const tierConfig = {
	platinum: { label: "Platinum", bg: "bg-blue-100", text: "text-blue-600" },
	gold: { label: "Gold", bg: "bg-amber-100", text: "text-amber-600" },
	silver: { label: "Silver", bg: "bg-gray-100", text: "text-gray-500" },
	bronze: { label: "Bronze", bg: "bg-orange-100", text: "text-orange-600" },
=======
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const tierConfig = {
  platinum: { label: "Platinum", bg: "bg-primary-light", text: "text-primary" },
  gold: { label: "Gold", bg: "bg-amber-100", text: "text-amber-600" },
  silver: { label: "Silver", bg: "bg-surface", text: "text-text-secondary" },
  bronze: { label: "Bronze", bg: "bg-orange-100", text: "text-orange-600" },
>>>>>>> feat/newVersion
};

const formatRupiah = (n) => `Rp ${n.toLocaleString("id-ID")}`;

const getInitials = (name) =>
<<<<<<< HEAD
	name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

// Main Page
export default function CustomerList() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

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

	// Filter logic
	const filtered = customersData.filter((c) => {
		const q = searchQuery.toLowerCase();
		return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
	});

	const maxGrowth = Math.max(...customerGrowth.map((g) => g.value));

	return (
		<div className='flex min-h-screen bg-[#f8fafc] font-sans text-[#1e293b]'>
			<Sidebar className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-[#07122a] text-white flex flex-col transition-all duration-300 shrink-0`} />

			<div className='flex flex-col flex-1 min-w-0'>
				{/* Header */}
				<Header
					onToggleSidebar={() => setSidebarOpen((v) => !v)}
					onSearch={(query) => console.log("search:", query)}
				/>

				{/* Content */}
				<main className='p-8 flex flex-col gap-6 overflow-auto'>
					{/* Page Title */}
					<h1 className='text-3xl font-bold text-gray-900'>Manajemen Pelanggan</h1>

					{/* Customer Stats */}
					<div className='grid grid-cols-4 gap-5'>
						<article className='p-6 bg-white border border-gray-200 rounded-2xl'>
							<div className='w-9 h-9 flex items-center justify-center rounded-full bg-green-100 mb-3'>
								<LuUsers className='text-[18px] text-green-600' />
							</div>
							<h2 className='text-3xl font-bold mb-2'>{customerStats.totalCustomers.toLocaleString("id-ID")}</h2>
							<p className='text-sm text-gray-500'>Total Pelanggan</p>
						</article>

						<article className='p-6 bg-white border border-gray-200 rounded-2xl'>
							<div className='w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 mb-3'>
								<LuTrendingUp className='text-[18px] text-blue-600' />
							</div>
							<h2 className='text-3xl font-bold mb-2'>{customerStats.newThisMonth}</h2>
							<p className='text-sm text-gray-500'>Pelanggan Baru (Bulan Ini)</p>
						</article>

						<article className='p-6 bg-white border border-gray-200 rounded-2xl'>
							<div className='w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 mb-3'>
								<LuShoppingBag className='text-[18px] text-orange-600' />
							</div>
							<h2 className='text-3xl font-bold mb-2'>{customerStats.avgOrders}</h2>
							<p className='text-sm text-gray-500'>Rata-rata Pesanan</p>
						</article>

						<article className='p-6 bg-white border border-gray-200 rounded-2xl'>
							<div className='w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 mb-3'>
								<LuStar className='text-[18px] text-amber-500' />
							</div>
							<h2 className='text-3xl font-bold mb-2'>{customerStats.satisfaction}/5</h2>
							<p className='text-sm text-gray-500'>Kepuasan Pelanggan</p>
						</article>
					</div>

					{/* Chart */}
					<div className='p-6 bg-white border border-gray-200 rounded-2xl'>
						<div className='mb-6'>
							<h2 className='text-lg font-semibold text-gray-900'>Pertumbuhan Pelanggan Baru (2026)</h2>
						</div>

						<div className='h-60 rounded-xl bg-[repeating-linear-gradient(to_top,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_40px)] flex items-end justify-around gap-4 px-6 pb-4'>
							{customerGrowth.map((g) => (
								<div
									key={g.month}
									className='flex flex-col items-center gap-2 flex-1 h-full justify-end'>
									<div
										className='w-full max-w-10 bg-blue-500 rounded-t-md transition-all'
										style={{ height: `${(g.value / maxGrowth) * 85}%` }}
										title={`${g.month}: ${g.value}`}
									/>
									<span className='text-xs text-slate-400'>{g.month}</span>
								</div>
							))}
						</div>
					</div>

					{/* Search */}
					<div className='flex flex-col gap-1 p-4 bg-white border border-slate-200 rounded-2xl'>
						<div className='relative'>
							<FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]' />
							<input
								{...register("query")}
								type='text'
								placeholder='Cari nama, email, atau kota...'
								className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-gray-900 bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#1a73e8]"}`}
							/>
						</div>
						{errors.query && <p className='text-xs text-red-500 ml-1'>{errors.query.message}</p>}
					</div>

					{/* Table */}
					<div className='bg-white border border-slate-200 rounded-2xl overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full border-collapse text-sm'>
								<thead className='bg-[#f8fafc]'>
									<tr>
										{["Pelanggan", "Kota", "Bergabung", "Total Pesanan", "Total Belanja", "Tier", "Aksi"].map((h) => (
											<th
												key={h}
												className='px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide'>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filtered.length === 0 ? (
										<tr>
											<td
												colSpan={7}
												className='py-12 text-center text-sm text-gray-400'>
												Tidak ada pelanggan yang cocok.
											</td>
										</tr>
									) : (
										filtered.map((c) => (
											<tr
												key={c.id}
												className='border-t border-slate-100 hover:bg-gray-50 transition-colors'>
												{/* Profile */}
												<td className='px-4 py-4'>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center shrink-0'>{getInitials(c.name)}</div>
														<div className='flex flex-col'>
															<strong className='font-medium text-gray-900'>{c.name}</strong>
															<small className='text-gray-500 text-[13px]'>{c.email}</small>
														</div>
													</div>
												</td>

												{/* City */}
												<td className='px-4 py-4 text-gray-700'>{c.city}</td>

												{/* Join Date */}
												<td className='px-4 py-4 text-gray-700'>{c.joinDate}</td>

												{/* Total Orders */}
												<td className='px-4 py-4 text-gray-700'>{c.totalOrders}</td>

												{/* Total Spending */}
												<td className='px-4 py-4 font-medium text-blue-600'>{formatRupiah(c.totalSpending)}</td>

												{/* Tier */}
												<td className='px-4 py-4'>
													<span className={`inline-flex px-2.5 py-1.25 text-xs font-medium rounded-full ${tierConfig[c.tier].bg} ${tierConfig[c.tier].text}`}>{tierConfig[c.tier].label}</span>
												</td>

												{/* Actions */}
												<td className='px-4 py-4'>
													<div className='flex items-center gap-2'>
														<button
															className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
															title='Lihat'>
															<FiEye className='text-[15px] text-gray-500' />
														</button>
														<button
															className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 transition-colors cursor-pointer'
															title='Kirim Email'>
															<FiMail className='text-[15px] text-blue-500' />
														</button>
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
=======
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Main Page
export default function CustomerList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Filter logic
  const filtered = customersData.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const maxGrowth = Math.max(...customerGrowth.map((g) => g.value));

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
          <h1 className="text-3xl font-bold text-text-primary">
            Manajemen Pelanggan
          </h1>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <article className="p-6 card-base shadow-sm">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-success-light mb-3">
                <LuUsers className="text-[18px] text-success" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {customerStats.totalCustomers.toLocaleString("id-ID")}
              </h2>
              <p className="text-sm text-text-secondary">Total Pelanggan</p>
            </article>

            <article className="p-6 card-base shadow-sm">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-light mb-3">
                <LuTrendingUp className="text-[18px] text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {customerStats.newThisMonth}
              </h2>
              <p className="text-sm text-text-secondary">
                Pelanggan Baru (Bulan Ini)
              </p>
            </article>

            <article className="p-6 card-base shadow-sm">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 mb-3">
                <LuShoppingBag className="text-[18px] text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {customerStats.avgOrders}
              </h2>
              <p className="text-sm text-text-secondary">Rata-rata Pesanan</p>
            </article>

            <article className="p-6 card-base shadow-sm">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 mb-3">
                <LuStar className="text-[18px] text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {customerStats.satisfaction}/5
              </h2>
              <p className="text-sm text-text-secondary">Kepuasan Pelanggan</p>
            </article>
          </div>

          {/* Chart */}
          <div className="p-6 card-base shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Pertumbuhan Pelanggan Baru (2026)
              </h2>
            </div>

            <div className="h-60 rounded-xl bg-[repeating-linear-gradient(to_top,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_40px)] flex items-end justify-around gap-4 px-6 pb-4">
              {customerGrowth.map((g) => (
                <div
                  key={g.month}
                  className="flex flex-col items-center gap-2 flex-1 h-full justify-end"
                >
                  <div
                    className="w-full max-w-10 bg-primary rounded-t-md transition-all"
                    style={{ height: `${(g.value / maxGrowth) * 85}%` }}
                    title={`${g.month}: ${g.value}`}
                  />
                  <span className="text-xs text-text-secondary">{g.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1 p-4 card-base shadow-sm">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[15px]" />
              <input
                {...register("query")}
                type="text"
                placeholder="Cari nama, email, atau kota..."
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
                      "Tier",
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
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada pelanggan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        {/* Profile */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-light text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                              {getInitials(c.name)}
                            </div>
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
                          {formatRupiah(c.totalSpending)}
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1.25 text-xs font-medium rounded-full ${tierConfig[c.tier].bg} ${tierConfig[c.tier].text}`}
                          >
                            {tierConfig[c.tier].label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
                              title="Lihat"
                            >
                              <FiEye className="text-[15px] text-text-secondary" />
                            </button>
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                              title="Kirim Email"
                            >
                              <FiMail className="text-[15px] text-primary" />
                            </button>
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
>>>>>>> feat/newVersion
}
