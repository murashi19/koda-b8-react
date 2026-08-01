import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import products from "@/features/products/data/products";

import ProductCard from "@/features/products/components/ProductCard";

export default function BestProduct() {
  const bestProducts = products
    .filter((p) => p.tags.includes("best"))
    .slice(0, 6);

  return (
    <div className="container-page px-4 xl:px-0 flex flex-col gap-10">
      {/* ===== BEST PRODUCT SECTION ===== */}
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-text-primary leading-7.5">
            Produk Unggulan
          </h2>
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
          {bestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
