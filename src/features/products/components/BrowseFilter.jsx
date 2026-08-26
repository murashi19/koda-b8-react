import { useState } from "react";
import StarRating from "@/components/common/StarsRate";
import { SlidersHorizontal } from "lucide-react";

const ratingOptions = [5, 4, 3];
const INITIAL_BRAND_LIMIT = 10;
export default function BrowseFilter({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  selectedRating,
  onRatingChange,
  inStock,
  onStockChange,
  priceMax,
  onPriceChange,
}) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands
    ? brands
    : brands.slice(0, INITIAL_BRAND_LIMIT);

  const hasMoreBrands = brands.length > INITIAL_BRAND_LIMIT;
  return (
    <aside className="flex w-full lg:w-64 shrink-0 flex-col gap-6 h-fit card-base p-5 shadow-sm lg:sticky lg:top-40">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <SlidersHorizontal className="w-4 h-4 text-primary" />

        <h2 className="font-semibold text-text-primary text-sm">
          Filter Produk
        </h2>
      </div>

      {/* HARGA */}
      <div>
        <h3 className="font-semibold text-sm text-text-primary mb-3">
          Harga Maksimal
        </h3>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
            Rp
          </span>
          <input
            type="number"
            min="0"
            step="1000"
            inputMode="numeric"
            value={priceMax ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onPriceChange(value === "" ? null : Number(value));
            }}
            placeholder="Tanpa batas"
            aria-label="Harga maksimal"
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary"
          />
        </div>
        <p className="mt-1.5 text-xs text-text-secondary">
          Kosongkan untuk menampilkan semua harga.
        </p>
      </div>

      {/* MEREK */}
      <div>
        <h3 className="font-semibold text-sm text-text-primary mb-3">Merek</h3>

        <div className="flex flex-col gap-2.5">
          {visibleBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandChange(brand)}
                className="accent-primary w-4 h-4 rounded"
              />

              <span className="truncate">{brand}</span>
            </label>
          ))}
        </div>

        {/* Tampilkan semua / lebih sedikit */}
        {hasMoreBrands && (
          <button
            type="button"
            onClick={() => setShowAllBrands((prev) => !prev)}
            className="mt-3 text-sm font-medium text-primary hover:text-primary-dark hover:underline cursor-pointer"
          >
            {showAllBrands
              ? "Tampilkan lebih sedikit"
              : `Tampilkan semua brand (${brands.length})`}
          </button>
        )}
      </div>

      {/* RATING */}
      <div>
        <h3 className="font-semibold text-sm text-text-primary mb-3">
          Rating Minimum
        </h3>

        <div className="flex flex-col gap-2.5">
          {ratingOptions.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <input
                className="accent-primary w-4 h-4 cursor-pointer"
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => onRatingChange(rating)}
              />
              <StarRating className="w-3.5 h-3.5" rating={rating} />
              <span>{rating}.0+</span>
            </label>
          ))}
        </div>

        {selectedRating !== null && (
          <button
            type="button"
            onClick={() => onRatingChange(null)}
            className="mt-3 text-xs text-primary hover:underline cursor-pointer"
          >
            Hapus filter rating
          </button>
        )}
      </div>

      {/* STOCK */}
      <div>
        <h3 className="font-semibold text-sm text-text-primary mb-3">
          Ketersediaan
        </h3>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">
          <input
            type="checkbox"
            checked={inStock}
            onChange={onStockChange}
            className="accent-primary w-4 h-4 rounded"
          />

          <span>Stok tersedia</span>
        </label>
      </div>
    </aside>
  );
}
