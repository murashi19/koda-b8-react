import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons

import { BsStarFill } from "react-icons/bs";
import { FiEye, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { RiFilter3Line } from "react-icons/ri";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";
import AddProductModal from "@/features/admin/components/AddProduct";

// Product Data
import { summaryCards } from "@/features/products/data/products";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct } from "@/features/products/productsSlice";

import { toggleSidebar } from "@/features/admin/dashboardSlice";

// Yup Schema
const searchSchema = yup.object({
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

const categories = [
  "Semua Kategori",
  "Elektronik",
  "Fashion",
  "Rumah & Dapur",
  "Kecantikan",
];

const badgeConfig = {
  new: { label: "Baru", bg: "bg-primary-light", text: "text-primary" },
  featured: { label: "Unggulan", bg: "bg-amber-100", text: "text-amber-600" },
  promo: { label: "Promo", bg: "bg-red-100", text: "text-red-600" },
};

// Delete Confirm Modal
function DeleteModal({ product, onConfirm, onCancel }) {
<<<<<<< HEAD
	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
			<div className='bg-white rounded-2xl p-6 w-100 flex flex-col gap-4 shadow-xl'>
				<h3 className='text-base font-semibold text-gray-900'>Hapus Produk?</h3>
				<p className='text-sm text-gray-500'>
					Apakah kamu yakin ingin menghapus <strong>{product.name}</strong>? Tindakan ini tidak bisa dibatalkan.
				</p>
				<div className='flex gap-3 justify-end'>
					<button
						onClick={onCancel}
						className='px-4 py-2 text-sm border border-black/10 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors'>
						Batal
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors'>
						Hapus
					</button>
				</div>
			</div>
		</div>
	);
=======
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-100 flex flex-col gap-4 shadow-xl">
        <h3 className="text-base font-semibold text-text-primary">
          Hapus Produk?
        </h3>
        <p className="text-sm text-text-secondary">
          Apakah kamu yakin ingin menghapus <strong>{product.name}</strong>?
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-border rounded-xl text-text-secondary hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
>>>>>>> feat/newVersion
}

// Main Page
export default function ProductList() {
<<<<<<< HEAD
	const navigate = useNavigate();
	// const [activeNav, setActiveNav] = useState("products");
	const { sidebarOpen } = useSelector((state) => state.dashboard);
	const products = useSelector((state) => state.products.items);
	const dispatch = useDispatch();
	const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
	const [deleteTarget, setDeleteTarget] = useState(null);

	const [showModal, setShowModal] = useState(false);
	const handleAddProduct = (data) => {
		dispatch(
			addProduct({
				id: products.length + 1,
				name: data.nama,
				brand: data.merek,
				category: data.kategori,
				image: URL.createObjectURL(data.gambar[0]),
				description: data.deskripsi,
				discountPrice: Number(data.harga),
				regularPrice: data.hargaAsli ? Number(data.hargaAsli) : null,
				stock: Number(data.stok),
				rating: 0,
				review: 0,
				badges: [...(data.baru ? ["new"] : []), ...(data.unggulan ? ["featured"] : [])],
				wishlist: false,
				createdAt: Date.now(),
			}),
		);

		setShowModal(false);
	};

	const {
		watch,
		register,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(searchSchema),
		defaultValues: { query: "" },
		mode: "onChange",
	});

	const searchQuery = watch("query") ?? "";

	// Filter logic
	const filtered = products.filter((p) => {
		const matchSearch = p.name?.toLowerCase().includes(searchQuery?.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery?.toLowerCase());
		const matchCategory = categoryFilter === "Semua Kategori" || p.category === categoryFilter;
		return matchSearch && matchCategory;
	});

	const handleDelete = (id) => {
		dispatch(deleteProduct(id));
		setDeleteTarget(null);
	};

	return (
		<div className='flex min-h-screen bg-[#f8fafc] font-sans text-[#1e293b]'>
			<Sidebar className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-[#07122a] text-white flex flex-col transition-all duration-300 shrink-0`} />

			<div className='flex flex-col flex-1 min-w-0'>
				{/* Header */}
				<Header
					onToggleSidebar={() => dispatch(toggleSidebar())}
					onSearch={(query) => console.log("search:", query)}
				/>

				{/* Content */}
				<main className='p-8 flex flex-col gap-6 overflow-auto'>
					{/* Page Title */}
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold text-gray-900'>Manajemen Produk</h1>
						<button
							onClick={() => setShowModal(true)}
							className='flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer'>
							+ Tambah Produk
						</button>
					</div>

					{/* Toolbar — Search + Filter with RHF + Yup */}
					<div className='flex gap-4 p-4 bg-white border border-slate-200 rounded-2xl'>
						{/* Search */}
						<div className='flex flex-col flex-1 gap-1'>
							<div className='relative'>
								<FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]' />
								<input
									{...register("query")}
									type='text'
									placeholder='Cari produk atau merek...'
									className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-gray-900 bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#1a73e8]"}`}
								/>
							</div>
							{errors.query && <p className='text-xs text-red-500 ml-1'>{errors.query.message}</p>}
						</div>
						{/* Category Filter */}
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='h-12 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 outline-none focus:border-[#1a73e8] transition-colors cursor-pointer'>
							{categories.map((c) => (
								<option key={c}>{c}</option>
							))}
						</select>

						{/* Filter Button */}
						<button className='flex items-center gap-2 h-12 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>
							<RiFilter3Line className='text-[16px]' />
							Filter
						</button>
					</div>

					{/* Summary Cards */}
					<div className='grid grid-cols-4 gap-5'>
						{summaryCards.map((s) => (
							<div
								key={s.label}
								className='bg-white border border-slate-200 rounded-2xl p-6 text-center'>
								<h3 className='text-4xl font-bold text-gray-900 mb-2'>{s.value}</h3>
								<p className='text-sm text-gray-500'>{s.label}</p>
							</div>
						))}
					</div>

					{/* Table */}
					<div className='bg-white border border-slate-200 rounded-2xl overflow-hidden'>
						<div className='px-5 py-4 font-semibold text-gray-900 border-b border-slate-200'>{filtered.length} Produk</div>

						<div className='overflow-x-auto'>
							<table className='w-full border-collapse text-sm'>
								<thead className='bg-[#f8fafc]'>
									<tr>
										{["Produk", "Kategori", "Harga", "Stok", "Rating", "Status", "Aksi"].map((h) => (
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
												Tidak ada produk yang cocok.
											</td>
										</tr>
									) : (
										filtered.map((p) => (
											<tr
												key={p.id}
												className='border-t border-slate-100 hover:bg-gray-50 transition-colors'>
												{/* Product */}
												<td className='px-4 py-4'>
													<div className='flex items-center gap-3'>
														<img
															src={p.image}
															alt={p.name}
															className='w-12 h-12 object-cover rounded-xl border border-black/10'
														/>
														<div>
															<p className='font-semibold text-gray-900'>{p.name}</p>
															<p className='text-xs text-gray-500 mt-0.5'>{p.brand}</p>
														</div>
													</div>
												</td>

												{/* Category */}
												<td className='px-4 py-4'>
													<span className='px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium'>{p.category}</span>
												</td>

												{/* Price */}
												<td className='px-4 py-4'>
													<span className='block font-semibold text-blue-600'>
														{new Intl.NumberFormat("id-ID", {
															style: "currency",
															currency: "IDR",
														}).format(p.discountPrice)}
													</span>
													{p.regularPrice && (
														<span className='text-xs text-gray-400 line-through'>
															{new Intl.NumberFormat("id-ID", {
																style: "currency",
																currency: "IDR",
															}).format(p.regularPrice)}
														</span>
													)}
												</td>

												{/* Stock */}
												<td className={`px-4 py-4 font-medium ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>{p.stock}</td>

												{/* Rating */}
												<td className='px-4 py-4'>
													<div className='flex items-center gap-1 text-amber-500 font-semibold text-sm'>
														<BsStarFill className='text-[13px]' />
														{p.rating}
													</div>
												</td>

												{/* Badges */}
												<td className='px-4 py-4'>
													<div className='flex flex-wrap gap-1'>
														{p.badges?.map((b) => (
															<span
																key={b}
																className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${badgeConfig[b]?.bg} ${badgeConfig[b]?.text}`}>
																{badgeConfig[b]?.label}
															</span>
														))}
													</div>
												</td>

												{/* Actions */}
												<td className='px-4 py-4'>
													<div className='flex items-center gap-2'>
														<button
															onClick={() => navigate(`/admin/products/${p.id}`)}
															className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
															title='Lihat'>
															<FiEye className='text-[15px] text-gray-500' />
														</button>
														<button
															onClick={() => navigate(`/admin/products/${p.id}/edit`)}
															className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 transition-colors cursor-pointer'
															title='Edit'>
															<FiEdit2 className='text-[15px] text-blue-500' />
														</button>
														<button
															onClick={() => setDeleteTarget(p)}
															className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer'
															title='Hapus'>
															<FiTrash2 className='text-[15px] text-red-500' />
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

			{showModal && (
				<AddProductModal
					onClose={() => setShowModal(false)}
					onSubmit={handleAddProduct}
				/>
			)}

			{/* Delete Confirm Modal */}
			{deleteTarget && (
				<DeleteModal
					product={deleteTarget}
					onConfirm={() => handleDelete(deleteTarget.id)}
					onCancel={() => setDeleteTarget(null)}
				/>
			)}
		</div>
	);
=======
  const navigate = useNavigate();
  // const [activeNav, setActiveNav] = useState("products");
  const { sidebarOpen } = useSelector((state) => state.dashboard);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleAddProduct = (data) => {
    dispatch(
      addProduct({
        id: products.length + 1,
        name: data.nama,
        brand: data.merek,
        category: data.kategori,
        image: URL.createObjectURL(data.gambar[0]),
        description: data.deskripsi,
        discountPrice: Number(data.harga),
        regularPrice: data.hargaAsli ? Number(data.hargaAsli) : null,
        stock: Number(data.stok),
        rating: 0,
        review: 0,
        badges: [
          ...(data.baru ? ["new"] : []),
          ...(data.unggulan ? ["featured"] : []),
        ],
        wishlist: false,
        createdAt: Date.now(),
      }),
    );

    setShowModal(false);
  };

  const {
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const searchQuery = watch("query") ?? "";

  // Filter logic
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery?.toLowerCase());
    const matchCategory =
      categoryFilter === "Semua Kategori" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    setDeleteTarget(null);
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
              Manajemen Produk
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 btn-accent text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              + Tambah Produk
            </button>
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
                  placeholder="Cari produk atau merek..."
                  className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm text-text-primary bg-white outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
                />
              </div>
              {errors.query && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.query.message}
                </p>
              )}
            </div>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 px-4 border border-border rounded-xl bg-white text-sm text-text-primary outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Filter Button */}
            <button className="flex items-center gap-2 h-12 px-4 border border-border rounded-xl bg-white text-sm text-text-primary hover:bg-surface transition-colors cursor-pointer">
              <RiFilter3Line className="text-[16px]" />
              Filter
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {summaryCards.map((s) => (
              <div
                key={s.label}
                className="card-base shadow-sm p-6 text-center"
              >
                <h3 className="text-4xl font-bold text-text-primary mb-2">
                  {s.value}
                </h3>
                <p className="text-sm text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 font-semibold text-text-primary border-b border-border">
              {filtered.length} Produk
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-surface">
                  <tr>
                    {[
                      "Produk",
                      "Kategori",
                      "Harga",
                      "Stok",
                      "Rating",
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
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada produk yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        {/* Product */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-xl border border-border"
                            />
                            <div>
                              <p className="font-semibold text-text-primary">
                                {p.name}
                              </p>
                              <p className="text-xs text-text-secondary mt-0.5">
                                {p.brand}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4">
                          <span className="px-2.5 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4">
                          <span className="block font-semibold text-primary">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(p.discountPrice)}
                          </span>
                          {p.regularPrice && (
                            <span className="text-xs text-text-secondary line-through">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(p.regularPrice)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td
                          className={`px-4 py-4 font-medium ${p.stock <= 5 ? "text-red-500" : "text-text-primary"}`}
                        >
                          {p.stock}
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                            <BsStarFill className="text-[13px]" />
                            {p.rating}
                          </div>
                        </td>

                        {/* Badges */}
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {p.badges?.map((b) => (
                              <span
                                key={b}
                                className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${badgeConfig[b]?.bg} ${badgeConfig[b]?.text}`}
                              >
                                {badgeConfig[b]?.label}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/products/${p.id}`)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
                              title="Lihat"
                            >
                              <FiEye className="text-[15px] text-text-secondary" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/products/${p.id}/edit`)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <FiEdit2 className="text-[15px] text-primary" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <FiTrash2 className="text-[15px] text-red-500" />
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

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
>>>>>>> feat/newVersion
}
