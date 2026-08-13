import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  ImageIcon,
  Minus,
  Plus,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { animateScroll } from "react-scroll";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import StarRating from "@/components/common/StarsRate";
import ProductCard from "@/features/products/components/ProductCard";

// Hooks
import useCart from "@/features/cart/useCart";
import useWishlist from "@/features/wishlist/useWishlist";

// Redux
import {
  fetchProducts,
  fetchProductById,
  clearProductDetail,
} from "@/features/products/productsSlice";

// Utils / Data
import getProductBadge from "@/utils/getProductBadge";
import category from "@/features/products/data/category";
// DELIVERY INF

const deliveryInfo = [
  {
    icon: Truck,
    label: "Gratis Ongkir",
    sub: "Min. Rp 100.000",
  },
  {
    icon: Shield,
    label: "Pembayaran Aman",
    sub: "SSL Terenkripsi",
  },
  {
    icon: RefreshCw,
    label: "Retur 30 Hari",
    sub: "Gratis retur",
  },
];
// TAB

const tabs = ["Deskripsi", "Spesifikasi", "Ulasan (2)"];
// MAIN PAG

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

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Deskripsi");
  const [selectedImg, setSelectedImg] = useState(null);

  // FETCH PRODUCT DETAIL

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch]);

  // FETCH PRODUCTS FOR RELATED PRODUCTS
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [items.length, dispatch]);

  // SCROLL TO TOP
  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 700,
      smooth: "easeInOutQuart",
    });
  }, [id]);

  // LOADING
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

  // PRODUCT NOT FOUND
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
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Lihat Semua Produk
          </button>
        </main>

        <Footer />
      </>
    );
  }

  // PRODUCT DATA

  const wishlisted = isWishlisted(product.id);
  const badge = getProductBadge(product);
  const tags = Array.isArray(product.tags) ? product.tags : [];

  // NORMALIZE GALLERY

  const galleryImages = [];

  if (product.image) {
    galleryImages.push(product.image);
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((image) => {
      const imageUrl = typeof image === "string" ? image : image?.image_url;

      if (imageUrl && !galleryImages.includes(imageUrl)) {
        galleryImages.push(imageUrl);
      }
    });
  }

  const displayedImg = selectedImg || galleryImages[0] || product.image || null;

  // CATEGORY
  const productCategory = category.find((cat) => cat.name === product.category);
  const categorySlug = productCategory?.slug ?? "";

  // RELATED PRODUCTS
  const relatedProducts = items
    .filter((item) => item.id !== product.id)
    .filter((item) => !product.category || item.category === product.category)
    .slice(0, 4);

  // HANDLERS
  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    const success = addToCart(product, quantity);
    if (success !== false) {
      navigate("/cart");
    }
  };
  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };
  const increaseQuantity = () => {
    setQuantity((current) => Math.min(product.stock, current + 1));
  };

  return (
    <>
      <Header className="fixed" />
      <ButtonMessage />
      <main className="container-page px-4 mb-12">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-1 text-sm text-text-secondary mt-6 mb-8 overflow-x-auto whitespace-nowrap">
          {[
            {
              label: "Beranda",
              to: "/",
            },
            {
              label: "Toko",
              to: "/browse-product",
            },
            {
              label: product.category,
              to: `/browse-product/${categorySlug}`,
            },
            {
              label: product.name,
              to: "#",
            },
          ].map((item, index, arr) => (
            <span
              key={`${item.label}-${index}`}
              className="flex items-center gap-1 shrink-0"
            >
              <Link
                to={item.to}
                className={
                  index === arr.length - 1
                    ? "text-text-secondary cursor-default pointer-events-none max-w-50 truncate"
                    : "text-text-secondary hover:text-text-primary transition-colors"
                }
              >
                {item.label}
              </Link>

              {index < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              )}
            </span>
          ))}
        </nav>

        {/*  PRODUCT MAIN */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - PRODUCT IMAGES */}
          <div className="w-full lg:w-xl shrink-0">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface border border-border">
              {displayedImg ? (
                <img
                  src={displayedImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}

              {/* Badge */}

              {badge && (
                <span className="absolute top-4 left-4 bg-accent text-white text-sm px-3 py-1 rounded-full font-medium">
                  {badge.label}
                </span>
              )}
            </div>

            {/* Thumbnails */}

            {galleryImages.length > 0 && (
              <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImg(image)}
                    className={`
                      w-16 h-16 shrink-0 rounded-xl overflow-hidden
                      border-2 transition-colors duration-300
                      ${
                        displayedImg === image
                          ? "border-primary"
                          : "border-border hover:border-primary/40"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - PRODUCT INFORMATION*/}
          <div className="flex-1 flex flex-col gap-5">
            {/* Product Name */}
            <div>
              <p className="text-sm text-text-secondary mb-1">
                {product.brand} · {product.category}
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                {product.name}
              </h1>

              {/* Rating + Stock */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-text-secondary ml-1">
                    {product.rating}
                  </span>
                  <span className="text-sm text-text-secondary">
                    ({product.review})
                  </span>
                </div>
                <span
                  className={`
                    text-sm font-medium px-2.5 py-1 rounded-full
                    ${
                      product.stock > 0
                        ? "bg-success-light text-success"
                        : "bg-red-50 text-red-500"
                    }
                  `}
                >
                  {product.stock > 0
                    ? `✓ Stok tersedia (${product.stock})`
                    : "Stok habis"}
                </span>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      px-2.5 py-1
                      rounded-full
                      bg-primary-light
                      text-primary
                      text-xs
                      font-medium
                    "
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="bg-primary-light rounded-xl px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[28px] font-bold text-primary leading-10">
                  {product.discountPriceFormatted ??
                    product.regularPriceFormatted}
                </span>

                {product.discountPriceFormatted && (
                  <span className="text-lg text-text-secondary line-through">
                    {product.regularPriceFormatted}
                  </span>
                )}
                {badge?.type === "discount" && (
                  <span className="bg-accent text-white text-xs px-2.5 py-1 rounded-full">
                    {badge.label}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm text-text-primary mb-2">Jumlah</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={product.stock <= 0 || quantity <= 1}
                    className="
                      w-11 h-10
                      flex items-center justify-center
                      text-text-primary
                      hover:bg-surface
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition-colors
                    "
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-14 h-10 flex items-center justify-center border-x border-border text-sm font-medium text-text-primary">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                    className="
                      w-11 h-10
                      flex items-center justify-center
                      text-text-primary
                      hover:bg-surface
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition-colors
                    "
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-sm text-text-secondary">
                  Stok: {product.stock} pcs
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="
                  flex items-center justify-center gap-2
                  flex-1 sm:min-w-60
                  h-14
                  rounded-xl
                  border-2 border-accent
                  text-accent
                  text-base font-medium
                  hover:bg-accent hover:text-white
                  transition-colors duration-300
                  disabled:opacity-40
                  disabled:hover:bg-transparent
                  disabled:hover:text-accent
                  disabled:cursor-not-allowed
                "
              >
                <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2} />
                Tambah ke Keranjang
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="
                  flex-1 sm:min-w-40
                  h-14
                  rounded-xl
                  bg-accent
                  border-2 border-accent
                  text-white
                  text-base font-medium
                  hover:bg-white hover:text-accent
                  transition-colors duration-300
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                Beli Sekarang
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="
                  w-14 h-14
                  rounded-xl
                  border-2 border-border
                  flex items-center justify-center
                  hover:bg-surface
                  transition-colors duration-300
                "
              >
                <Heart
                  className="w-6 h-6"
                  strokeWidth={2}
                  stroke={wishlisted ? "#f97316" : "#6b7280"}
                  fill={wishlisted ? "#f97316" : "none"}
                />
              </button>
            </div>

            {/* Delivery Information */}

            <div className="grid grid-cols-3 gap-2 mt-1">
              {deliveryInfo.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="
                      flex flex-col items-center
                      text-center
                      border border-border
                      bg-surface
                      rounded-lg
                      py-3 px-1
                    "
                >
                  <Icon className="w-4 h-4 text-primary mb-1" strokeWidth={2} />

                  <span className="text-xs text-text-primary leading-4">
                    {label}
                  </span>

                  <span className="text-[11px] text-text-secondary leading-4">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESCRIPTION / SPECIFICATION / REVIEW*/}

        <div className="mt-10 card-base overflow-hidden shadow-sm">
          {/* Tabs */}

          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  min-w-28 px-4
                  h-14
                  text-sm font-medium
                  transition-colors
                  whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}

          <div className="p-6 text-sm md:text-base text-text-secondary leading-relaxed">
            {/* DESCRIPTION */}

            {activeTab === "Deskripsi" &&
              (product.description ? (
                <p className="whitespace-pre-line">{product.description}</p>
              ) : (
                <p className="text-text-secondary">
                  Belum ada deskripsi untuk produk ini.
                </p>
              ))}

            {/* SPECIFICATIONS */}

            {activeTab === "Spesifikasi" &&
              (product.specifications ? (
                <ul className="list-disc list-inside space-y-2">
                  {product.specifications
                    .split("|")
                    .map((spec) => spec.trim())
                    .filter(Boolean)
                    .map((spec, index) => (
                      <li key={`${spec}-${index}`}>{spec}</li>
                    ))}
                </ul>
              ) : (
                <p className="text-text-secondary">
                  Belum ada spesifikasi untuk produk ini.
                </p>
              ))}

            {/* REVIEWS */}

            {activeTab.startsWith("Ulasan") && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-text-primary">
                      {product.rating}
                    </p>

                    <StarRating rating={product.rating} />
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">
                      Berdasarkan {product.review} ulasan
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-text-secondary">
                    Ulasan pelanggan akan ditampilkan di sini.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS*/}

        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary">
                Produk Terkait
              </h2>

              {categorySlug && (
                <Link
                  to={`/browse-product/${categorySlug}`}
                  className="text-sm text-primary hover:underline"
                >
                  Lihat Semua
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
