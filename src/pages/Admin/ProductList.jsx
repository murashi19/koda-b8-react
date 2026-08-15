import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// react-icons
import { BsStarFill } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { RiFilter3Line } from "react-icons/ri";

// Components
import Header from "@/features/admin/components/AdminHeader";
import Sidebar from "@/features/admin/components/AdminSidebar";
import AddProductModal from "@/features/admin/components/AddProduct";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  editProduct,
  removeProduct,
  setPage,
} from "@/features/products/productsSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { fetchTags } from "@/features/tags/tagsSlice";
import { getFullImageUrl } from "@/lib/imageUrl";
import { TAG_CONFIG } from "@/features/products/data/tagConfig";

import { toggleSidebar } from "@/features/admin/dashboardSlice";
import { ImageIcon } from "lucide-react";

// Yup Schema
const searchSchema = yup.object({
  query: yup
    .string()
    .trim()
    .max(100, "Pencarian maksimal 100 karakter")
    .matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid"),
});

// Delete Confirm Modal
function DeleteModal({ product, onConfirm, onCancel, isDeleting }) {
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
            disabled={isDeleting}
            className="px-4 py-2 text-sm border border-border rounded-xl text-text-secondary hover:bg-surface transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-60"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function ProductList() {
  const { sidebarOpen } = useSelector((state) => state.dashboard);
  const {
    items: products,
    status: productsStatus,
    mutationStatus,
    mutationError,
    pagination,
  } = useSelector((state) => state.products);
  const { items: categories, status: categoriesStatus } = useSelector(
    (state) => state.categories,
  );
  const { items: tags, status: tagsStatus } = useSelector(
    (state) => state.tags,
  );
  const dispatch = useDispatch();

  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalMode, setModalMode] = useState(null);

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

  useEffect(() => {
    if (categoriesStatus === "idle") dispatch(fetchCategories());
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    if (tagsStatus === "idle") dispatch(fetchTags());
  }, [tagsStatus, dispatch]);

  const currentPage = pagination.currentPage;
  const itemsPerPage = pagination.itemsPerPage;

  // reset halaman
  useEffect(() => {
    if (currentPage !== 1) {
      dispatch(setPage(1));
    }
  }, [searchQuery, categoryFilter, currentPage, dispatch]);

  // fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);
      if (searchQuery.trim()) {
        params.set("search[name]", searchQuery.trim());
      }
      if (categoryFilter && categoryFilter !== "Semua Kategori") {
        params.set("search[category]", categoryFilter);
      }
      dispatch(fetchProducts(params.toString()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, currentPage, itemsPerPage, searchQuery, categoryFilter]);

  const buildQueryString = (page = currentPage) => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", itemsPerPage);
    if (searchQuery.trim()) {
      params.set("search[name]", searchQuery.trim());
    }
    if (categoryFilter && categoryFilter !== "Semua Kategori") {
      params.set("search[category]", categoryFilter);
    }
    return params.toString();
  };

  const submitProduct = async (formData) => {
    if (modalMode === "add") {
      const result = await dispatch(
        createProduct({
          formData,
          queryString: buildQueryString(),
        }),
      );
      if (createProduct.fulfilled.match(result)) {
        setModalMode(null);
      }
    } else if (modalMode?.mode === "edit") {
      const result = await dispatch(
        editProduct({
          id: modalMode.data.id,
          formData,
          queryString: buildQueryString(),
        }),
      );
      if (editProduct.fulfilled.match(result)) {
        setModalMode(null);
      }
    }
  };

  const summaryCards = [
    { value: pagination.totalItems, label: "Total Produk" },
    {
      value: products.filter((p) => p.tags?.includes("new")).length,
      label: "Produk Baru",
    },
    {
      value: products.filter((p) => p.stock <= 10).length,
      label: "Stok Rendah",
    },
    {
      value: products.filter((p) => p.discountPrice != null).length,
      label: "Produk Promo",
    },
  ];

  const handleDelete = async (id) => {
    setIsDeleting(true);
    const result = await dispatch(removeProduct(id));
    setIsDeleting(false);
    if (removeProduct.fulfilled.match(result)) setDeleteTarget(null);
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans text-secondary">
      <Sidebar
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-secondary text-white flex flex-col transition-all duration-300 shrink-0`}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onToggleSidebar={() => dispatch(toggleSidebar())}
          onSearch={(query) => console.log("search:", query)}
        />

        <main className="p-8 flex flex-col gap-6 overflow-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">
              Manajemen Produk
            </h1>
            <button
              onClick={() => setModalMode("add")}
              className="flex items-center gap-2 px-5 py-3 btn-accent text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              + Tambah Produk
            </button>
          </div>

          <div className="flex gap-4 p-4 card-base shadow-sm">
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 px-4 border border-border rounded-xl bg-white text-sm text-text-primary outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option>Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>

            <button className="flex items-center gap-2 h-12 px-4 border border-border rounded-xl bg-white text-sm text-text-primary hover:bg-surface transition-colors cursor-pointer">
              <RiFilter3Line className="text-[16px]" />
              Filter
            </button>
          </div>

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

          <div className="card-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 font-semibold text-text-primary border-b border-border">
              {pagination.totalItems} Produk{" "}
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
                      "Tag",
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
                  {productsStatus === "loading" ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Memuat produk...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-secondary"
                      >
                        Tidak ada produk yang cocok.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-border hover:bg-surface transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {getFullImageUrl(p.image) ? (
                              <img
                                src={getFullImageUrl(p.image)}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xl border border-border"
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl border border-border">
                                <ImageIcon className="w-10 h-10 text-gray-400" />
                              </div>
                            )}

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

                        <td className="px-4 py-4">
                          <span className="px-2.5 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
                            {p.category}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="block font-semibold text-primary">
                            {p.discountPriceFormatted ??
                              p.regularPriceFormatted}
                          </span>
                          {p.discountPriceFormatted && (
                            <span className="text-xs text-text-secondary line-through">
                              {p.regularPriceFormatted}
                            </span>
                          )}
                        </td>

                        <td
                          className={`px-4 py-4 font-medium ${p.stock <= 5 ? "text-red-500" : "text-text-primary"}`}
                        >
                          {p.stock}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                            <BsStarFill className="text-[13px]" />
                            {p.rating}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {p.tags?.map((t) => (
                              <span
                                key={t}
                                className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${TAG_CONFIG[t]?.bg ?? "bg-border"} ${TAG_CONFIG[t]?.text ?? "text-text-secondary"}`}
                              >
                                {TAG_CONFIG[t]?.label ?? t}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setModalMode({ mode: "edit", data: p })
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

            <div className="flex items-center justify-between px-5 py-4 border-t border-border">
              <p className="text-sm text-text-secondary">
                Menampilkan{" "}
                <span className="font-medium text-text-primary">
                  {products.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-text-primary">
                  {pagination.totalItems}
                </span>{" "}
                produk
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
                  {pagination.currentPage} / {pagination.totalPages}
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

      {(modalMode === "add" || modalMode?.mode === "edit") && (
        <AddProductModal
          initialData={modalMode?.mode === "edit" ? modalMode.data : undefined}
          categories={categories}
          tags={tags}
          onClose={() => setModalMode(null)}
          onSubmit={submitProduct}
          isSaving={mutationStatus === "loading"}
          serverError={mutationStatus === "failed" ? mutationError : ""}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
