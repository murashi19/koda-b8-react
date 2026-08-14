import { useEffect, useState, useMemo } from "react";
import { Truck, ChevronRight, Plus, MapPin, CheckCircle2 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchAddresses, createAddress } from "@/features/address/addressSlice";
import AddressModal from "@/features/profile/components/AddressModal";
import { SHIPPING_METHODS as shippingOptions } from "@/features/checkout/data/shippingMethods";

export default function CheckoutStep1() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkoutData, updateCheckoutData } = useOutletContext();

  const { items: addresses, status: addressesStatus } = useSelector(
    (state) => state.addresses,
  );

  useEffect(() => {
    if (addressesStatus === "idle") dispatch(fetchAddresses());
  }, [addressesStatus, dispatch]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    checkoutData.addressId ?? null,
  );
  const [selectedShipping, setSelectedShipping] = useState(
    checkoutData.shippingMethod ?? "same-day",
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const defaultAddressId = useMemo(() => {
    if (addresses.length === 0) return null;
    const main = addresses.find((a) => a.isDefault);
    return (main ?? addresses[0]).id;
  }, [addresses]);

  const effectiveAddressId = selectedAddressId ?? defaultAddressId;

  const mustCreateFirst =
    addressesStatus === "succeeded" && addresses.length === 0;

  const handleCreateAddress = async (form) => {
    setIsSavingAddress(true);
    setAddressError("");
    try {
      const created = await dispatch(createAddress(form)).unwrap();
      setSelectedAddressId(created.id);
      setShowAddModal(false);
    } catch (err) {
      setAddressError(typeof err === "string" ? err : "Gagal menyimpan alamat");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleContinue = () => {
    if (!effectiveAddressId) return;
    updateCheckoutData({
      addressId: effectiveAddressId,
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

      {addressesStatus === "loading" && (
        <p className="text-sm text-text-secondary py-6 text-center">
          Memuat alamat tersimpan...
        </p>
      )}

      {addressesStatus === "failed" && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-red-500">Gagal memuat alamat.</p>
          <button
            type="button"
            onClick={() => dispatch(fetchAddresses())}
            className="text-xs text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
          >
            Coba lagi
          </button>
        </div>
      )}

      {addressesStatus === "succeeded" && mustCreateFirst && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <MapPin className="w-10 h-10 text-text-secondary" strokeWidth={1.5} />
          <p className="text-sm text-text-secondary max-w-xs">
            Kamu belum punya alamat tersimpan. Tambahkan alamat pengiriman dulu
            untuk melanjutkan checkout.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 h-11 px-5 btn-primary text-sm font-medium rounded-xl"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Tambah Alamat
          </button>
        </div>
      )}

      {addressesStatus === "succeeded" && !mustCreateFirst && (
        <>
          {/* Pilihan alamat tersimpan */}
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => setSelectedAddressId(addr.id)}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${effectiveAddressId === addr.id ? "border-primary bg-primary-light/40" : "border-border hover:border-border bg-white"}`}
              >
                <div className="mt-0.5 shrink-0">
                  {effectiveAddressId === addr.id ? (
                    <CheckCircle2
                      className="w-5 h-5 text-primary"
                      strokeWidth={2}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="h-5 px-2 rounded-full text-[10px] font-medium text-white bg-primary flex items-center">
                        Utama
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-text-secondary mt-1">
                    {addr.address}
                    {addr.subdistrict ? `, ${addr.subdistrict}` : ""}
                    {addr.district ? `, ${addr.district}` : ""}
                    {`, ${addr.city}, ${addr.province}`}
                    {addr.postalCode ? ` ${addr.postalCode}` : ""}
                  </span>
                </div>
              </button>
            ))}

            {/* Tambah alamat baru — buat kirim ke alamat lain */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit mt-1"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Tambah alamat baru
            </button>
          </div>

          {/* Metode Pengiriman */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-text-primary">
              Metode Pengiriman
            </span>
            {shippingOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedShipping(opt.id)}
                className={`w-full text-left flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${selectedShipping === opt.id ? "border-primary bg-primary-light/40" : "border-border bg-white"}`}
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {opt.label}
                  </p>
                  <p className="text-xs text-text-secondary">{opt.sub}</p>
                </div>
                <span className="text-sm font-medium text-primary">
                  {opt.price}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!effectiveAddressId}
            className="w-full h-12 rounded-xl btn-primary text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lanjut ke Pembayaran
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </>
      )}

      {showAddModal && (
        <AddressModal
          onClose={() => setShowAddModal(false)}
          onSave={handleCreateAddress}
          isSaving={isSavingAddress}
          dismissible={!mustCreateFirst}
        />
      )}
      {addressError && (
        <p className="text-xs text-red-500 text-center">{addressError}</p>
      )}
    </div>
  );
}
