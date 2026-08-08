import { useState } from "react";
import { IoClose } from "react-icons/io5";

const inputClass = (hasError) =>
  `w-full h-11 rounded-xl border ${hasError ? "border-red-400" : "border-border"} bg-surface px-4 text-sm text-text-primary outline-none focus:border-primary transition-colors placeholder:text-text-secondary`;

const textareaClass = (hasError) =>
  `w-full rounded-xl border ${hasError ? "border-red-400" : "border-border"} bg-surface px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors placeholder:text-text-secondary resize-none`;

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// Field names harus sinkron dengan mapper di @/features/address/addressSlice.js
const REQUIRED_FIELDS = ["label", "address", "province", "city", "postalCode"];

const emptyForm = {
  label: "",
  address: "",
  province: "",
  city: "",
  district: "",
  subdistrict: "",
  postalCode: "",
  note: "",
};

export default function AddressModal({
  initialData,
  onClose,
  onSave,
  isSaving = false,
  dismissible = true,
}) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field]?.trim()) {
        newErrors[field] = "Wajib diisi";
      }
    });

    if (
      form.postalCode?.trim() &&
      !/^[0-9]{4,10}$/.test(form.postalCode.trim())
    ) {
      newErrors.postalCode = "Kode pos tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isSaving) return;
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-text-primary">
            {isEditMode ? "Edit Alamat" : "Tambah Alamat Baru"}
          </h2>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors disabled:opacity-60"
            >
              <IoClose className="w-4.5 h-4.5 text-text-secondary" />
            </button>
          )}
        </div>

        {/* Form */}
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label required>Label Alamat</Label>
            <input
              type="text"
              name="label"
              placeholder="Rumah, Kantor, dll."
              value={form.label}
              onChange={handleChange}
              className={inputClass(errors.label)}
            />
            {errors.label && (
              <p className="text-xs text-red-500 mt-1">{errors.label}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label required>Alamat Lengkap</Label>
            <textarea
              name="address"
              rows={2}
              placeholder="Jl. Contoh No. 123, RT/RW 01/02"
              value={form.address}
              onChange={handleChange}
              className={textareaClass(errors.address)}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <Label required>Kota</Label>
            <input
              type="text"
              name="city"
              placeholder="Jakarta Barat"
              value={form.city}
              onChange={handleChange}
              className={inputClass(errors.city)}
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label required>Provinsi</Label>
            <input
              type="text"
              name="province"
              placeholder="DKI Jakarta"
              value={form.province}
              onChange={handleChange}
              className={inputClass(errors.province)}
            />
            {errors.province && (
              <p className="text-xs text-red-500 mt-1">{errors.province}</p>
            )}
          </div>

          <div>
            <Label>Kecamatan</Label>
            <input
              type="text"
              name="district"
              placeholder="Kebon Jeruk"
              value={form.district}
              onChange={handleChange}
              className={inputClass(errors.district)}
            />
          </div>

          <div>
            <Label>Kelurahan</Label>
            <input
              type="text"
              name="subdistrict"
              placeholder="Sukabumi Selatan"
              value={form.subdistrict}
              onChange={handleChange}
              className={inputClass(errors.subdistrict)}
            />
          </div>

          <div>
            <Label required>Kode Pos</Label>
            <input
              type="text"
              name="postalCode"
              placeholder="11530"
              value={form.postalCode}
              onChange={handleChange}
              className={inputClass(errors.postalCode)}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label>Catatan</Label>
            <textarea
              name="note"
              rows={2}
              placeholder="Patokan, warna pagar, dll. (opsional)"
              value={form.note}
              onChange={handleChange}
              className={textareaClass(errors.note)}
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-text-primary bg-white hover:bg-surface transition-colors disabled:opacity-60"
            >
              Batal
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 h-11 rounded-xl btn-primary text-sm font-medium disabled:opacity-60"
          >
            {isSaving
              ? "Menyimpan..."
              : isEditMode
                ? "Simpan Perubahan"
                : "Tambah Alamat"}
          </button>
        </div>
      </div>
    </div>
  );
}
