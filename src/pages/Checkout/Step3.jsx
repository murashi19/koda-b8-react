import { useState } from "react";
import { CheckCircle, Shield, Lock, AlertCircle } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useCart from "@/features/cart/useCart";
import { placeOrder } from "@/features/orders/ordersSlice";
import { SHIPPING_METHODS } from "@/features/checkout/data/shippingMethods";
import { PAYMENT_METHOD_LABELS as paymentLabels } from "@/features/checkout/data/paymentMethods";

// Label pengiriman yang lebih detail (label + estimasi), dibangun dari satu
// sumber data SHIPPING_METHODS supaya tidak ada daftar duplikat yang bisa beda sendiri.
const shippingLabels = Object.fromEntries(
  SHIPPING_METHODS.map((m) => [m.id, `${m.label} · ${m.sub}`]),
);

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");

export default function CheckoutStep3() {
  const navigate = useNavigate();
  const { checkoutData } = useOutletContext();
  const dispatch = useDispatch();
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const auth = useSelector((state) => state.auth.user);
  const address = useSelector((state) =>
    state.addresses.items.find((a) => a.id === checkoutData.addressId),
  );

  const { shippingMethod, paymentMethod } = checkoutData;

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePay = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const order = await dispatch(
        placeOrder({
          addressId: checkoutData.addressId,
          shippingMethod,
          paymentMethod,
        }),
      ).unwrap();
      navigate("/success", { state: { orderId: order.id } });
    } catch (err) {
      setErrorMsg(
        typeof err === "string" ? err : "Gagal memproses pesanan, coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Left: Order Confirmation */}
      <div className="flex-1 w-full card-base p-6 flex flex-col gap-4">
        {/* Heading */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" strokeWidth={2} />
          <span className="text-base font-medium text-text-primary">
            Konfirmasi Pesanan
          </span>
        </div>

        {/* Alamat Pengiriman */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Alamat Pengiriman
          </p>
          <span className="text-sm text-text-secondary">
            {auth?.full_name} · {auth?.phone_number}
          </span>
          <span className="text-sm text-text-secondary">
            {address ? (
              <>
                {address.label} — {address.address}
                {address.subdistrict ? `, ${address.subdistrict}` : ""}
                {address.district ? `, ${address.district}` : ""}
                {`, ${address.city}, ${address.province}`}
                {address.postalCode ? ` ${address.postalCode}` : ""}
              </>
            ) : (
              "Alamat belum dipilih"
            )}
          </span>
        </div>

        {/* Metode Pengiriman */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Metode Pengiriman
          </p>
          <span className="text-sm text-text-secondary">
            {shippingLabels[shippingMethod] ?? "-"}
          </span>
        </div>

        {/* Metode Pembayaran */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Metode Pembayaran
          </p>
          <span className="text-sm text-text-secondary">
            {paymentLabels[paymentMethod] ?? "-"}
          </span>
        </div>

        {/* Produk yang Dipesan */}
        <div className="flex flex-col gap-3 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary">
            Produk yang Dipesan
          </p>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
              <div className="flex-1 flex flex-col ml-1">
                <span className="text-sm font-medium text-text-primary">
                  {item.name}
                </span>
                <span className="text-xs text-text-secondary">x{item.qty}</span>
              </div>
              <span className="text-sm font-normal text-primary">
                {formatRp(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Terms Notice */}
        <div className="flex items-center gap-3 bg-primary-light border border-primary-light rounded-xl p-4">
          <Shield className="w-6 h-6 text-primary shrink-0" strokeWidth={2} />
          <span className="text-xs text-text-secondary">
            Dengan menekan "Bayar Sekarang", kamu menyetujui Syarat & Ketentuan
            kami. Pembayaran baru akan diproses setelah kamu mengkonfirmasi di
            langkah ini.
          </span>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle
              className="w-4 h-4 text-red-500 shrink-0"
              strokeWidth={2}
            />
            <span className="text-xs text-red-600">{errorMsg}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/checkout/step2")}
            disabled={isSubmitting}
            className="w-24 h-12 border border-border rounded-xl text-sm font-medium text-text-primary bg-white hover:bg-surface transition-colors disabled:opacity-60"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={isSubmitting || !checkoutData.addressId}
            className="flex-1 h-12 rounded-xl btn-primary text-base font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Lock className="w-5 h-5" strokeWidth={2} />
            <span>
              {isSubmitting
                ? "Memproses..."
                : `Bayar ${formatRp(total)} Sekarang`}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
