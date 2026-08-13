import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "@/features/products/components/ProductCard";
import { fetchProducts } from "@/features/products/productsSlice";
import { hasProductTag } from "../../../utils/product";

// Countdown timer — mulai dari 5 jam 21 menit 38 detik
const Timer = 5 * 3600 + 21 * 60 + 38;

function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return { h, m, s };
}

export default function FlashDeal() {
  const { h, m, s } = useCountdown(Timer);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Tampilkan maksimal 4 produk dengan tag "flash"
  const flashProducts = products
    .filter((product) => hasProductTag(product, "flash"))
    .slice(0, 4);

  if (status === "loading" || status === "idle") {
    return (
      <section className="container-page px-4 xl:px-0 py-10 text-center text-text-secondary">
        Memuat produk...
      </section>
    );
  }

  if (status === "failed") {
    return null;
  }

  return (
    <section className="container-page px-4 xl:px-0 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Label Flash Deal */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-full">
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-semibold">Flash Deal</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Berakhir dalam:</span>
            <span className="font-semibold text-text-primary tabular-nums">
              {h} : {m} : {s}
            </span>
          </div>
        </div>

        <Link
          to="/browse-product"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-300"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Jika tidak ada flash product */}
      {flashProducts.length === 0 && (
        <div className="py-10 text-center text-text-secondary">
          Belum ada produk Flash Deal.
        </div>
      )}
    </section>
  );
}
