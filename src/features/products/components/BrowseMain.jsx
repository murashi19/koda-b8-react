import { useMemo, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animateScroll } from "react-scroll";
import { ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/features/products/components/ProductCard";
import BrowseFilter from "@/features/products/components/BrowseFilter";

import useProductFilter from "@/features/products/hooks/useProductFilter";
import usePagination from "@/features/products/hooks/usePagination";

import { fetchProducts } from "@/features/products/productsSlice";
import category from "@/features/products/data/category";

export default function BrowseMain() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);

  // URL STATE
  const searchQuery = searchParams.get("q") ?? "";
  const selectedBrands = searchParams.getAll("brand");
  const selectedRating = Number(searchParams.get("rating")) || null;
  const inStock = searchParams.get("stock") === "1";
  const priceMax = Number(searchParams.get("priceMax")) || 20000000;
  const page = Number(searchParams.get("page")) || 1;

  // CATEGORY FROM SLUG (static lookup, independent of fetched products)
  const currentCategory = useMemo(
    () => category.find((cat) => cat.slug === slug),
    [slug],
  );

  // FETCH PRODUCTS (uses backend search + paging)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search[name]", searchQuery);
    }
    if (currentCategory?.name) {
      params.set("search[category]", currentCategory.name);
    }
    // Backend caps limit at 100 - large enough to cover the catalog so
    // brand/rating/stock/price refinement and pagination below stay accurate.
    params.set("limit", "100");
    dispatch(fetchProducts(params.toString()));
  }, [dispatch, searchQuery, currentCategory?.name]);

  // URL PARAM HELPER
  const setParam = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setParam({ page: null });
  }, [searchQuery, currentCategory?.name, setParam]);

  // PAGINATION
  const changePage = (newPage) => {
    animateScroll.scrollToTop({
      duration: 700,
      smooth: "easeInOutQuart",
    });
    setParam({
      page: newPage,
    });
  };

  // BRAND FILTER
  const toggleBrand = (brand) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = next.getAll("brand");
      next.delete("brand");
      const updated = current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand];
      updated.forEach((item) => {
        next.append("brand", item);
      });

      // Reset pagination
      next.set("page", "1");
      return next;
    });
  };

  // BRANDS
  const brands = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.brand).filter(Boolean)),
    ].sort();
  }, [products]);

  const { filteredProducts } = useProductFilter(
    products,
    currentCategory?.name,
    selectedBrands,
    selectedRating,
    inStock,
    priceMax,
  );

  // PAGINATION DATA
  const { displayedData, currentPage, totalPages, hasNextPage, hasPrevPage } =
    usePagination(filteredProducts, page, 16);

  // LOADING
  if (status === "loading" || status === "idle") {
    return (
      <div className="container-page py-20 text-center text-text-secondary">
        Memuat produk...
      </div>
    );
  }

  // ERROR
  if (status === "failed") {
    return (
      <div className="container-page py-20 text-center text-red-500">
        Gagal memuat produk. Coba muat ulang halaman.
      </div>
    );
  }

  // INVALID CATEGORY
  if (slug && !currentCategory) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold">Kategori tidak ditemukan</h1>
      </div>
    );
  }
  // PAGE TITLE
  const pageTitle = searchQuery
    ? `Hasil pencarian untuk "${searchQuery}"`
    : slug
      ? currentCategory.name
      : "Semua Produk";

  // RENDER
  return (
    <main className="container-page px-4 mb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-text-secondary mt-6 mb-6">
        <Link to="/" className="text-text-secondary hover:text-text-primary">
          Beranda
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span>
          {searchQuery
            ? "Hasil Pencarian"
            : slug
              ? currentCategory?.name
              : "Semua Produk"}
        </span>
      </nav>

      {/* Title */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6">
        {pageTitle}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* FILTER*/}

        <BrowseFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandChange={toggleBrand}
          selectedRating={selectedRating}
          onRatingChange={(value) =>
            setParam({
              rating: value === selectedRating ? null : value,
              page: "1",
            })
          }
          inStock={inStock}
          onStockChange={() =>
            setParam({
              stock: inStock ? null : "1",
              page: "1",
            })
          }
          priceMax={priceMax}
          onPriceChange={(value) =>
            setParam({
              priceMax: value === 20000000 ? null : value,
              page: "1",
            })
          }
        />

        {/* PRODUCTS*/}

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

          {/* PAGINATION*/}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              {/* Previous */}
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:border-primary/40 disabled:opacity-50 disabled:hover:border-border transition-colors duration-300 cursor-pointer"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => changePage(pageNumber)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer ${
                      currentPage === pageNumber
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next */}
              <button
                type="button"
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
