import { useState } from "react";
import { Trash2, Heart, Shield, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Data
import { products } from "@/features/products/data/products";

// Hooks (Redux)
import useCart from "@/features/cart/useCart";
import useWishlist from "@/features/wishlist/useWishlist";
// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/features/products/components/ProductCard";
import { useSelector } from "react-redux";

// Main Page
export default function Cart() {
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState("");
  const auth = useSelector((state) => state.auth.user);
  const { cart, updateCartQty, removeFromCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSaveToWishlist = (item) => {
    if (!auth) return;
    if (!isWishlisted(item.productId)) {
      toggleWishlist({ id: item.productId });
    }
    removeFromCart(item.id);
  };

  const relatedProducts = products.slice(0, 4);

  return (
    <>
      <Header className="fixed" />
      <ButtonMessage />
      <main className="container-page px-4 mt-10 mb-12">
        {/* Heading */}
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6">
          Keranjang Belanja ({totalQty} item)
        </h1>

        {cart.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center gap-3 py-20 card-base">
            <ShoppingCart
              className="w-12 h-12 text-text-secondary"
              strokeWidth={1.5}
            />
            <p className="text-text-secondary text-sm">
              Keranjang kamu masih kosong
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary text-white text-sm font-medium transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          /* ── Main Grid ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_394px] gap-6 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {/* Card Item — looped dari cart */}
              {cart.map((item) => (
                <div key={item.id} className="card-base p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      {/* Title + Delete */}
                      <div className="flex items-start justify-between">
                        <span className="text-base font-medium text-text-primary leading-6">
                          {item.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Hapus item"
                          className="text-text-secondary hover:text-accent transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Brand */}
                      <p className="text-xs text-text-secondary">
                        {item.brand}
                      </p>

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-xl overflow-hidden w-37.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, item.qty - 1)}
                            className="w-11 h-9.5 text-lg text-text-primary hover:bg-surface transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            readOnly
                            className="w-13.5 h-9.5 text-center text-base border-x border-border bg-transparent outline-none text-text-primary"
                          />
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, item.qty + 1)}
                            className="w-11 h-9.5 text-lg text-text-primary hover:bg-surface transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-base text-primary">
                          {formatRp(item.subtotal)}
                        </span>
                      </div>

                      {/* Save to Wishlist */}
                      <button
                        type="button"
                        onClick={() => handleSaveToWishlist(item)}
                        className="flex items-center gap-1.5 w-fit text-xs text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Heart
                          className="w-3 h-3"
                          strokeWidth={3}
                          stroke={
                            isWishlisted(item.productId) ? "#f97316" : "#9ca3af"
                          }
                          fill={
                            isWishlisted(item.productId) ? "#f97316" : "white"
                          }
                        />
                        <span>Simpan ke Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Card Voucher */}
              <div className="card-base p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-base">🏷️</span>
                  <span className="text-sm font-medium text-text-primary">
                    Kode Promo
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Masukkan Kode Promo"
                    className="flex-1 h-10.5 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary transition-colors duration-300"
                  />
                  <button
                    type="button"
                    className="w-25.75 h-10.5 rounded-xl btn-primary text-sm font-medium"
                  >
                    Terapkan
                  </button>
                </div>
                <p className="text-xs text-text-secondary">
                  Coba: HEMAT10, BELIMUDAH, atau NEWUSER
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="card-base p-5 flex flex-col gap-4 shadow-sm lg:sticky lg:top-40">
              <h2 className="font-display text-lg font-bold text-text-primary">
                Ringkasan Pesanan
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal ({totalQty} item)</span>
                  <span>{formatRp(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Ongkos Kirim</span>
                  <span className="text-success font-semibold">GRATIS</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm font-medium text-text-primary">
                  <span>Total</span>
                  <span className="text-primary font-semibold text-base">
                    {formatRp(subtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  navigate("/checkout/step1");
                }}
                className="w-full h-13 rounded-xl btn-accent text-base font-medium flex items-center justify-center gap-2"
              >
                <Shield className="w-3.25 h-4" strokeWidth={2} />
                <span>Checkout Aman</span>
              </button>

              {/* Payment Info */}
              <div className="text-xs text-text-secondary text-center flex flex-col gap-1">
                <p>🔒 Pembayaran 100% Aman</p>
                <p>
                  Metode: Transfer Bank · Virtual Account · Kartu Kredit ·
                  e-Wallet
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Related Products ── */}
        <div className="mt-10">
          <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-5">
            Mungkin Kamu Suka Ini
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
