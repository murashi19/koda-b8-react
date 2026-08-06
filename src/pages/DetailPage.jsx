import { useState, useEffect } from "react";
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import StarRating from "@/components/common/StarsRate";
import ProductCard from "@/features/products/components/ProductCard";

// Hooks (Redux)
import useCart from "@/features/cart/useCart";
import useWishlist from "@/features/wishlist/useWishlist";

// Data
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductById,
  clearProductDetail,
} from "@/features/products/productsSlice";
import getProductBadge from "@/utils/getProductBadge";
import category from "@/features/products/data/category";
import { animateScroll } from "react-scroll";

// Data Delivery
const deliveryInfo = [
  { icon: Truck, label: "Gratis Ongkir", sub: "Min. Rp 100.000" },
  { icon: Shield, label: "Pembayaran Aman", sub: "SSL Terenkripsi" },
  { icon: RefreshCw, label: "Retur 30 Hari", sub: "Gratis retur" },
];

const colorOptions = ["Hitam", "Putih", "Biru"];
const tabs = ["Deskripsi", "Spesifikasi", "Ulasan (2)"];

// Main Page
export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: product, status } = useSelector(
    (state) => state.products.detail,
  );
  const { items } = useSelector((state) => state.products);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedColor, setSelectedColor] = useState("Hitam");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Deskripsi");
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgId, setSelectedImgId] = useState(id);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProductDetail());
  }, [id, dispatch]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [items.length, dispatch]);

  if (id !== selectedImgId) {
    setSelectedImgId(id);
    setSelectedImg(null);
  }
  const displayedImg = selectedImg ?? product?.image;

  useEffect(() => {
    animateScroll.scrollToTop({ duration: 700, smooth: "easeInOutQuart" });
  }, [id]);

  if (status === "loading" || status === "idle") {
    return (
      <>
        <Header className="fixed" />
        <main className="container-page px-4 py-20 text-center text-text-secondary">
          Memuat produk...
        </main>
        <Footer />
      </>
    );
  }

  if (status === "failed" || !product) {
    return (
      <>
        <Header className="fixed" />
        <ButtonMessage />
        <main className="container-page px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-4">
            Produk tidak ditemukan
          </h1>
          <button
            type="button"
            onClick={() => navigate("/browse-product")}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary text-white text-sm font-medium transition-colors"
          >
            Lihat Semua Produk
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const galleryImages = product.images;
  const badge = getProductBadge(product);

  // Cari slug kategori dari data/category.js (sumber kebenaran yang sama dipakai NavHeader & BrowseMain)
  const productCategory = category.find((cat) => cat.name === product.category);
  const categorySlug = productCategory?.slug ?? "";

  const relatedProducts = items.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <>
      <Header className="fixed" />
      <ButtonMessage />
      <main className="container-page px-4 mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-text-secondary mt-6 mb-12">
          {[
            { label: "Beranda", to: "/" },
            { label: "Toko", to: "/browse-product" },
            { label: product.category, to: `/browse-product/${categorySlug}` },
            { label: product.name, to: "#" },
          ].map((item, i, arr) => (
            <span key={item.label} className="flex items-center gap-1">
              <Link
                to={item.to}
                className={
                  i === arr.length - 1
                    ? "text-text-secondary cursor-default pointer-events-none"
                    : "text-text-secondary hover:text-text-primary transition-colors"
                }
              >
                {item.label}
              </Link>
              {i < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              )}
            </span>
          ))}
        </nav>

        {/* ── Product Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Images */}
          <div className="w-full lg:w-xl shrink-0">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
              <img
                src={displayedImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {badge && (
                <span className="absolute top-4 left-4 bg-accent text-white text-sm px-3 py-1 rounded-full">
                  {badge.label}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors duration-300 ${displayedImg === img ? "border-primary" : "border-border"}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detail */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Name */}
            <div>
              <p className="text-sm text-text-secondary mb-1">
                {product.brand} · {product.category}
              </p>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <StarRating rating={product.rating} />
                  <span className="text-base text-text-secondary ml-1">
                    {product.rating} ({product.review})
                  </span>
                </div>
                <span className="bg-success-light text-success text-sm font-medium px-2 py-0.5 rounded-full">
                  {product.stock > 0
                    ? `✓ Stok tersedia (${product.stock})`
                    : "Stok habis"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary-light rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-bold text-primary leading-10.5">
                  {product.discountPriceFormatted ??
                    product.regularPriceFormatted}
                </span>
                {product.discountPriceFormatted && (
                  <span className="text-lg text-text-secondary line-through">
                    {product.regularPriceFormatted}
                  </span>
                )}
                {badge?.type === "discount" && (
                  <span className="bg-accent text-white text-sm px-2.5 py-0.5 rounded-full">
                    Hemat {badge.label}
                  </span>
                )}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm text-text-primary mb-2">
                Warna: <span className="text-primary">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-8.5 px-3 rounded-lg text-sm border transition-colors duration-300 ${selectedColor === color ? "border-primary bg-primary-light text-primary" : "border-border text-text-primary hover:border-primary/40"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm text-text-primary mb-2">Jumlah</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl overflow-hidden w-37.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-9.5 text-lg text-text-primary hover:bg-surface transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-13.5 h-9.5 text-center text-base border-x border-border bg-transparent outline-none text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-11 h-9.5 text-lg text-text-primary hover:bg-surface transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-text-secondary">
                  Stok: {product.stock} pcs
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-2 flex-1 sm:w-67 h-14 rounded-xl border-2 border-accent text-accent text-base font-medium hover:bg-accent hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2} />
                Tambah ke Keranjang
              </button>
              <button
                type="button"
                onClick={() => {
                  const success = addToCart(product, quantity);
                  if (success) navigate("/cart");
                }}
                disabled={product.stock === 0}
                className="flex-1 sm:w-67 h-14 rounded-xl bg-accent border-2 border-accent text-white text-base font-medium hover:bg-white hover:text-accent transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Beli Sekarang
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="w-12 h-14 rounded-xl border-2 border-border flex items-center justify-center hover:bg-surface transition-colors duration-300"
              >
                <Heart
                  className="w-6 h-6"
                  strokeWidth={2}
                  stroke={wishlisted ? "#f97316" : "#6b7280"}
                  fill={wishlisted ? "#f97316" : "none"}
                />
              </button>
            </div>

            {/* Delivery Cards */}
            <div className="flex gap-2 mt-2">
              {deliveryInfo.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center text-center border border-border bg-surface rounded-lg py-2.5 px-1"
                >
                  <Icon className="w-4 h-4 text-primary mb-1" strokeWidth={2} />
                  <span className="text-xs text-text-primary leading-4">
                    {label}
                  </span>
                  <span className="text-xs text-text-secondary leading-4">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description / Tabs */}
        <div className="mt-10 card-base overflow-hidden shadow-sm">
          {/* Tab Nav */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-28 h-14 text-sm font-medium transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-text-secondary hover:text-text-primary"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 text-base text-text-secondary leading-relaxed">
            {activeTab === "Deskripsi" && <p>{product.description}</p>}

            {activeTab === "Spesifikasi" && (
              <ul className="list-disc list-inside space-y-1">
                {product.specifications
                  .split("|")
                  .map((spec) => spec.trim())
                  .filter(Boolean)
                  .map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
              </ul>
            )}

            {activeTab.startsWith("Ulasan") && (
              <p>Ulasan pelanggan akan ditampilkan di sini.</p>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mt-10">
          <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-5">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
