import useCart from "@/features/cart/useCart";
import { ImageIcon } from "lucide-react";

export default function OrderSummary() {
  const { cart } = useCart();
  const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <>
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 card-base p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="font-display text-base font-bold text-text-primary">
          Ringkasan Pesanan
        </h2>

        {/* Product List */}
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">
              Tidak ada produk di pesanan
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-100 border border-border shrink-0">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary leading-snug truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    x{item.qty}
                  </p>
                </div>
                <span className="text-sm text-text-primary shrink-0">
                  {formatRp(item.subtotal)}
                </span>
              </div>
            ))
          )}
        </div>

        <hr className="border-border" />

        {/* Price Breakdown */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Subtotal</span>
            <span>{formatRp(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Ongkir</span>
            <span className="text-success font-semibold">GRATIS</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-sm font-semibold text-text-primary">
            <span>Total</span>
            <span className="text-primary">{formatRp(subtotal)}</span>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-xs text-text-secondary text-center">
          🔒 Pembayaran aman dan terenkripsi
        </p>
      </div>
    </>
  );
}
