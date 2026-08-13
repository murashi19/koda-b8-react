import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "@/features/products/components/ProductCard";
import { fetchProducts } from "@/features/products/productsSlice";
import { hasProductTag } from "@/utils/product";

export default function NewProduct() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const newProducts = products
    .filter((product) => hasProductTag(product, "new"))
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2.5} />
          <h2 className="text-xl font-medium text-text-primary leading-7.5">
            Produk Terbaru
          </h2>
        </div>
        <Link
          to="/browse-product"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty state */}
      {newProducts.length === 0 && (
        <div className="py-10 text-center text-text-secondary">
          Belum ada produk terbaru.
        </div>
      )}
    </section>
  );
}
