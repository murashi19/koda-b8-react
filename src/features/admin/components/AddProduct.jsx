import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiX } from "react-icons/fi";
import { tagLabel } from "@/features/products/data/tagConfig";

// Yup Schema
const schema = yup.object({
  nama: yup
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter")
    .max(100, "Nama produk maksimal 100 karakter")
    .required("Nama produk wajib diisi"),

  merek: yup
    .string()
    .trim()
    .min(2, "Merek minimal 2 karakter")
    .max(50, "Merek maksimal 50 karakter")
    .required("Merek wajib diisi"),

  hargaNormal: yup
    .number()
    .typeError("Harga normal harus berupa angka")
    .positive("Harga normal harus lebih dari 0")
    .integer("Harga normal tidak boleh desimal")
    .required("Harga normal wajib diisi"),

  hargaDiskon: yup
    .number()
    .typeError("Harga diskon harus berupa angka")
    .positive("Harga diskon harus lebih dari 0")
    .integer("Harga diskon tidak boleh desimal")
    .max(
      yup.ref("hargaNormal"),
      "Harga diskon tidak boleh lebih besar dari harga normal",
    )
    .nullable()
    .transform((val, orig) => (orig === "" ? null : val)),

  stok: yup
    .number()
    .typeError("Stok harus berupa angka")
    .min(0, "Stok tidak boleh negatif")
    .integer("Stok harus bilangan bulat")
    .required("Stok wajib diisi"),

  kategoriId: yup
    .number()
    .typeError("Kategori wajib dipilih")
    .required("Kategori wajib dipilih"),

  gambar: yup.mixed(),

  deskripsi: yup
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .required("Deskripsi wajib diisi"),
});

// Field helpers
const inputClass = (err) =>
  `w-full h-11 rounded-xl border px-3 text-sm text-text-primary bg-surface outline-none transition-colors ${err ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`;

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// Modal — dipakai buat mode Tambah maupun Edit (initialData ada = mode edit)
export default function AddProductModal({
  initialData,
  categories = [],
  tags = [],
  onClose,
  onSubmit: onSubmitProp,
  isSaving = false,
  serverError = "",
}) {
  const isEditMode = Boolean(initialData);

  // Tag disimpan di produk sebagai nama ("new", "flash", dst), tapi checkbox-nya
  // butuh id tag (buat dikirim ke backend) — jadi perlu di-mapping ke id lewat daftar tags asli.
  const initialCheckedTagIds = new Set(
    tags.filter((t) => initialData?.tags?.includes(t.name)).map((t) => t.id),
  );
  const [checkedTagIds, setCheckedTagIds] = useState(initialCheckedTagIds);

  const toggleTag = (id) => {
    setCheckedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nama: initialData?.name ?? "",
      merek: initialData?.brand ?? "",
      hargaNormal: initialData?.regularPrice ?? "",
      hargaDiskon: initialData?.discountPrice ?? "",
      stok: initialData?.stock ?? "",
      kategoriId: initialData?.categoryId ?? categories[0]?.id ?? "",
      deskripsi: initialData?.description ?? "",
    },
  });

  const gambarFiles = watch("gambar");

  // Reset custom "gambar wajib" error tiap kali user pilih file baru
  useEffect(() => {
    if (gambarFiles?.length) {
      setError("gambar", undefined);
    }
  }, [gambarFiles, setError]);

  const onSubmit = (data) => {
    const hasImage = data.gambar && data.gambar.length > 0;
    if (!isEditMode && !hasImage) {
      setError("gambar", {
        type: "manual",
        message: "Gambar produk wajib diunggah",
      });
      return;
    }

    const formData = new FormData();
    formData.append("brand", data.merek);
    formData.append("name", data.nama);
    formData.append("category_id", data.kategoriId);
    formData.append("regular_price", data.hargaNormal);
    if (data.hargaDiskon != null) {
      formData.append("discount_price", data.hargaDiskon);
    }
    formData.append("stock", data.stok);
    formData.append("description", data.deskripsi);
    if (hasImage) {
      formData.append("image", data.gambar[0]);
    }
    formData.append("has_tag_ids", "1");
    checkedTagIds.forEach((id) => formData.append("tag_ids", id));

    onSubmitProp?.(formData);
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">
            {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiX className="text-[18px] text-text-secondary" />
          </button>
        </header>

        {/* Form — scrollable */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-6 py-5 overflow-y-auto"
        >
          {serverError && (
            <div className="rounded-lg bg-red-100 text-red-700 text-sm font-medium p-3">
              {serverError}
            </div>
          )}

          {/* Row: Nama + Merek */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Nama Produk</Label>
              <input
                {...register("nama")}
                type="text"
                placeholder="Masukkan nama produk"
                className={inputClass(errors.nama)}
              />
              <FieldError msg={errors.nama?.message} />
            </div>
            <div>
              <Label required>Merek</Label>
              <input
                {...register("merek")}
                type="text"
                placeholder="Masukkan merek"
                className={inputClass(errors.merek)}
              />
              <FieldError msg={errors.merek?.message} />
            </div>
          </div>

          {/* Row: Harga Normal + Harga Diskon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Harga Normal (IDR)</Label>
              <input
                {...register("hargaNormal")}
                type="number"
                placeholder="0"
                min={0}
                className={inputClass(errors.hargaNormal)}
              />
              <FieldError msg={errors.hargaNormal?.message} />
            </div>

            <div>
              <Label>Harga Diskon (IDR)</Label>
              <input
                {...register("hargaDiskon")}
                type="number"
                placeholder="Kosongkan kalau tidak promo"
                min={0}
                className={inputClass(errors.hargaDiskon)}
              />
              <FieldError msg={errors.hargaDiskon?.message} />
            </div>
          </div>

          {/* Row: Stok + Kategori */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Stok</Label>
              <input
                {...register("stok")}
                type="number"
                placeholder="0"
                min={0}
                className={inputClass(errors.stok)}
              />
              <FieldError msg={errors.stok?.message} />
            </div>
            <div>
              <Label required>Kategori</Label>
              <select
                {...register("kategoriId")}
                className={`${inputClass(errors.kategoriId)} cursor-pointer`}
              >
                {categories.length === 0 && (
                  <option value="">Memuat kategori...</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.kategoriId?.message} />
            </div>
          </div>

          {/* Gambar */}
          <div>
            <Label required={!isEditMode}>Gambar Produk</Label>
            {isEditMode && initialData?.image && (
              <img
                src={initialData.image}
                alt={initialData.name}
                className="w-16 h-16 rounded-lg object-cover border border-border mb-2"
              />
            )}
            <input
              {...register("gambar")}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={`w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary-light border rounded-xl px-3 py-2 transition-colors ${
                errors.gambar ? "border-red-400" : "border-border"
              }`}
            />
            <p className="text-xs text-text-secondary mt-1">
              {isEditMode ? "Kosongkan kalau tidak ingin ganti gambar. " : ""}
              Format: JPG, PNG, WebP. Maks 2MB.
            </p>
            <FieldError msg={errors.gambar?.message} />
          </div>

          {/* Deskripsi */}
          <div>
            <Label required>Deskripsi</Label>
            <textarea
              {...register("deskripsi")}
              rows={4}
              placeholder="Masukkan deskripsi produk"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm text-text-primary bg-surface outline-none resize-none transition-colors ${
                errors.deskripsi
                  ? "border-red-400 focus:border-red-500"
                  : "border-border focus:border-primary"
              }`}
            />
            <FieldError msg={errors.deskripsi?.message} />
          </div>

          {/* Tag */}
          <div>
            <Label>Tag Produk</Label>
            <div className="flex flex-wrap gap-3">
              {tags.length === 0 && (
                <p className="text-xs text-text-secondary">
                  Belum ada tag tersedia.
                </p>
              )}
              {tags.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checkedTagIds.has(t.id)}
                    onChange={() => toggleTag(t.id)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-primary">
                    {tagLabel(t.name)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <footer className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-xl hover:bg-surface transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-white btn-accent rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Tambah Produk"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
