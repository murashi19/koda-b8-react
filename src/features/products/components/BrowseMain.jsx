import { useMemo, useCallback } from "react";
import { animateScroll } from "react-scroll";
import { ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/features/products/components/ProductCard";
import BrowseFilter from "@/features/products/components/BrowseFilter";

import useProductFilter from "@/features/products/hooks/useProductFilter";
import usePagination from "@/features/products/hooks/usePagination";

import products from "@/features/products/data/products";
import category from "@/features/products/data/category";

export default function BrowseMain() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State
  const searchQuery = searchParams.get("q") ?? "";
  const selectedBrands = searchParams.getAll("brand");
  const selectedRating = Number(searchParams.get("rating")) || null;
  const inStock = searchParams.get("stock") === "1";
  const priceMax = Number(searchParams.get("priceMax")) || 20000000;
  const page = Number(searchParams.get("page")) || 1;

  // Helper
  const setParam = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });

        return next;
      });
    },
    [setSearchParams],
  );

  // Event Handler
  const changePage = (page) => {
    animateScroll.scrollToTop({
      duration: 700,
      smooth: "easeInOutQuart",
    });
    setParam({ page });
  };
  const toggleBrand = (brand) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = next.getAll("brand");
      next.delete("brand");
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      updated.forEach((b) => next.append("brand", b));
      next.set("page", "1");
      return next;
    });
  };

  // Derived Data
  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))],
    [],
  );
  const categoriesWithCount = useMemo(
    () =>
      category.map((cat) => ({
        ...cat,
        totalProduct: products.filter(
          (product) => product.category === cat.name,
        ).length,
      })),
    [],
  );
  const selectedCategory = categoriesWithCount.find((cat) => cat.slug === slug);

  // Custom Hooks
  const { filteredProducts } = useProductFilter(
    products,
    selectedCategory?.name,
    searchQuery,
    selectedBrands,
    selectedRating,
    inStock,
    priceMax,
  );
  const { displayedData, currentPage, totalPages, hasNextPage, hasPrevPage } =
    usePagination(filteredProducts, page, 16);

  // Early Return
  if (slug && !selectedCategory) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold">Kategori tidak ditemukan</h1>
      </div>
    );
  }

  // Derived Value
  const pageTitle = searchQuery
    ? `Hasil pencarian untuk "${searchQuery}"`
    : slug
      ? selectedCategory.name
      : "Semua Produk";

  return (
    <main className="container-page px-4 mb-12">
      <nav className="flex items-center gap-1 text-sm text-text-secondary mt-6 mb-6">
        <Link to="/" className="text-text-secondary hover:text-text-primary">
          Beranda
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span>
          {searchQuery
            ? "Hasil Pencarian"
            : slug
              ? selectedCategory?.name
              : "Semua Produk"}
        </span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6">
        {pageTitle}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <BrowseFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandChange={toggleBrand}
          selectedRating={selectedRating}
          onRatingChange={(val) =>
            setParam({ rating: val === selectedRating ? null : val, page: "1" })
          }
          inStock={inStock}
          onStockChange={() =>
            setParam({ stock: inStock ? null : "1", page: "1" })
          }
          priceMax={priceMax}
          onPriceChange={(val) =>
            setParam({ priceMax: val === 20000000 ? null : val, page: "1" })
          }
        />

        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-4">
            {filteredProducts.length} produk
          </p>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
              <p className="text-text-secondary text-sm">
                {searchQuery
                  ? `Tidak ada produk yang cocok dengan "${searchQuery}".`
                  : "Tidak ada produk yang cocok dengan filter ini."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:border-primary/40 disabled:opacity-50 disabled:hover:border-border transition-colors duration-300 cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => changePage(i + 1)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer ${currentPage === i + 1 ? "bg-primary text-white border-primary" : "bg-white border-border text-text-secondary hover:border-primary/40"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:border-primary/40 disabled:opacity-50 disabled:hover:border-border transition-colors duration-300 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
