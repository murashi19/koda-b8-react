import { useEffect, useState } from "react";
import { Truck, ChevronRight, Plus, MapPin, CheckCircle2 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { checkoutStep1Schema } from "@/features/checkout/validations/checkoutStep1Schema";
import { useSelector } from "react-redux";

const shippingOptions = [
  {
    id: "jne-reg",
    label: "JNE Reguler",
    sub: "3 - 5 hari kerja",
    price: "GRATIS",
  },
  {
    id: "jne-exp",
    label: "JNE Express",
    sub: "1 - 2 hari kerja",
    price: "GRATIS",
  },
  {
    id: "same-day",
    label: "Same Day Delivery",
    sub: "Hari ini (sebelum 16.00)",
    price: "GRATIS",
  },
];

const inputClass = (hasError) =>
  `w-full h-11 rounded-xl border ${hasError ? "border-red-400" : "border-border"} bg-surface px-4 text-sm text-text-primary outline-none focus:border-primary transition-colors placeholder:text-text-secondary`;

const textareaClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-primary transition-colors placeholder:text-text-secondary resize-none h-20";

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function CheckoutStep1() {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData } = useOutletContext();
  const auth = useSelector((state) => state.auth.user);

  const addresses = auth?.addresses ?? [];
  const hasAddresses = addresses.length > 0;

  // Default ke alamat utama atau alamat pertama
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const main = addresses.find((a) => a.isMain);
    return main?.id ?? addresses[0]?.id ?? null;
  });

  // Tampilkan card jika ada alamat, form jika tidak
  const [showForm, setShowForm] = useState(!hasAddresses);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutStep1Schema),
    defaultValues: checkoutData.shipping ?? {},
  });

  const selectedShipping = useWatch({
    control,
    name: "shippingMethod",
    defaultValue: checkoutData.shippingMethod ?? "same-day",
  });

  // Auto-fill data alamat utama
  useEffect(() => {
    if (auth) {
      reset({
        nama: checkoutData.shipping?.nama || auth.name || "",
        telepon: checkoutData.shipping?.telepon || auth.telepon || "",
        email: checkoutData.shipping?.email || auth.email || "",
        alamat:
          checkoutData.shipping?.alamat || auth.addresses?.[0]?.alamat || "",
        kota: checkoutData.shipping?.kota || auth.addresses?.[0]?.kota || "",
        provinsi:
          checkoutData.shipping?.provinsi ||
          auth.addresses?.[0]?.provinsi ||
          "",
        kodePos:
          checkoutData.shipping?.kodePos || auth.addresses?.[0]?.kodePos || "",
        catatan: checkoutData.shipping?.catatan || "",
        shippingMethod: checkoutData.shippingMethod ?? "same-day",
      });
    }
  }, [auth, checkoutData.shipping, checkoutData.shippingMethod, reset]);

  // Submit dari form manual
  const onSubmit = (data) => {
    const { shippingMethod, ...shipping } = data;
    updateCheckoutData({ shipping, shippingMethod });
    navigate("/checkout/step2");
  };

  // Lanjut dari card alamat tersimpan
  const handleContinueWithCard = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (!selected) return;

    updateCheckoutData({
      shipping: {
        nama: selected.name,
        telepon: selected.phone,
        email: auth.email,
        alamat: selected.alamat,
        kota: selected.kota,
        provinsi: selected.provinsi,
        kodePos: selected.kodePos,
        catatan: "",
      },
      shippingMethod: selectedShipping,
    });
    navigate("/checkout/step2");
  };

  return (
    <div className="flex-1 w-full card-base p-6 flex flex-col gap-6">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary" strokeWidth={2} />
        <span className="text-base font-medium text-text-primary">
          Alamat Pengiriman
        </span>
      </div>

      {/* ── Card pilihan alamat tersimpan ── */}
      {hasAddresses && !showForm ? (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => setSelectedAddressId(addr.id)}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${selectedAddressId === addr.id ? "border-primary bg-primary-light/40" : "border-border hover:border-border bg-white"}`}
            >
              {/* Checkmark */}
              <div className="mt-0.5 shrink-0">
                {selectedAddressId === addr.id ? (
                  <CheckCircle2
                    className="w-5 h-5 text-primary"
                    strokeWidth={2}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border" />
                )}
              </div>

              {/* Detail */}
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {addr.name}
                  </span>
                  {addr.isMain && (
                    <span className="h-5 px-2 rounded-full text-[10px] font-medium text-white bg-primary flex items-center">
                      Utama
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-secondary">
                  {addr.phone}
                </span>
                <span className="text-sm text-text-secondary mt-1">
                  {addr.alamat}, {addr.kota}, {addr.provinsi} {addr.kodePos}
                </span>
              </div>
            </button>
          ))}

          {/* Gunakan alamat lain */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm text-primary hover:underline w-fit mt-1"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Gunakan alamat lain
          </button>
        </div>
      ) : (
        /* ── Form manual ── */
        <>
          {/* Kembali ke card jika ada alamat tersimpan */}
          {hasAddresses && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit -mt-3"
            >
              <MapPin className="w-4 h-4" strokeWidth={2} />
              Pilih dari alamat tersimpan
            </button>
          )}

          <form
            id="checkout-step1"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label required>Nama Penerima</Label>
              <input
                type="text"
                placeholder="Budi Santoso"
                className={inputClass(errors.nama)}
                {...register("nama")}
              />
              {errors.nama && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.nama.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Nomor Telepon</Label>
              <input
                type="tel"
                placeholder="0812-3456-7890"
                className={inputClass(errors.telepon)}
                {...register("telepon")}
              />
              {errors.telepon && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.telepon.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label required>Email</Label>
              <input
                type="email"
                placeholder="budi@email.com"
                className={inputClass(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label required>Alamat Lengkap</Label>
              <input
                type="text"
                placeholder="Jl. Kebon Jeruk No. 15"
                className={inputClass(errors.alamat)}
                {...register("alamat")}
              />
              {errors.alamat && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.alamat.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Kota</Label>
              <input
                type="text"
                placeholder="Jakarta Barat"
                className={inputClass(errors.kota)}
                {...register("kota")}
              />
              {errors.kota && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.kota.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Provinsi</Label>
              <input
                type="text"
                placeholder="DKI Jakarta"
                className={inputClass(errors.provinsi)}
                {...register("provinsi")}
              />
              {errors.provinsi && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.provinsi.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Kode Pos</Label>
              <input
                type="text"
                placeholder="11530"
                className={inputClass(errors.kodePos)}
                {...register("kodePos")}
              />
              {errors.kodePos && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.kodePos.message}
                </p>
              )}
            </div>

            <div>
              <Label>Catatan (opsional)</Label>
              <textarea
                placeholder="Warna pagar, dll."
                className={textareaClass}
                {...register("catatan")}
              />
            </div>
          </form>
        </>
      )}

      {/* Shipping Methods */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-medium text-text-primary">
          Metode Pengiriman
        </h3>
        {shippingOptions.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedShipping === opt.id ? "border-primary bg-primary-light" : "border-border hover:border-border"}`}
          >
            <input
              type="radio"
              value={opt.id}
              checked={selectedShipping === opt.id}
              onChange={() => setValue("shippingMethod", opt.id)}
              className="accent-primary"
            />
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-text-primary">
                {opt.label}
              </span>
              <span className="text-xs text-text-secondary">{opt.sub}</span>
            </div>
            <span className="text-sm font-medium text-success">
              {opt.price}
            </span>
          </label>
        ))}
      </div>

      {/* Continue Button */}
      {hasAddresses && !showForm ? (
        <button
          type="button"
          onClick={handleContinueWithCard}
          disabled={!selectedAddressId}
          className="w-full h-12 rounded-xl btn-primary disabled:opacity-50 text-base font-medium flex items-center justify-center gap-2"
        >
          <span>Lanjut Ke Pembayaran</span>
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      ) : (
        <button
          type="submit"
          form="checkout-step1"
          className="w-full h-12 rounded-xl btn-primary text-base font-medium flex items-center justify-center gap-2"
        >
          <span>Lanjut Ke Pembayaran</span>
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
