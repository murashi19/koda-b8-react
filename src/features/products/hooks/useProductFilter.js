import { useMemo } from "react";

export default function useProductFilter(
  products = [],
  category,
  searchQuery = "",
  selectedBrands = [],
  selectedRating = null,
  inStock = false,
  priceMax = 20000000,
) {
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return (
      products
        // CATEGORY
        .filter((p) => {
          if (!category) return true;
          return p.category === category;
        })
        // PRICE
        .filter((p) => {
          const currentPrice =
            p.discountPrice !== null && p.discountPrice !== undefined
              ? p.discountPrice
              : p.regularPrice;
          return Number(currentPrice) <= Number(priceMax);
        })
        // BRAND
        .filter((p) => {
          if (selectedBrands.length === 0) {
            return true;
          }
          return selectedBrands.includes(p.brand);
        })
        // RATING
        .filter((p) => {
          if (selectedRating === null) {
            return true;
          }
          return Number(p.rating) >= Number(selectedRating);
        })
        // STOCK
        .filter((p) => {
          if (!inStock) {
            return true;
          }
          return Number(p.stock) > 0;
        })
        // SEARCH
        .filter((p) => {
          if (!query) {
            return true;
          }

          const name = String(p.name ?? "").toLowerCase();
          const brand = String(p.brand ?? "").toLowerCase();
          const productCategory = String(p.category ?? "").toLowerCase();

          return (
            name.includes(query) ||
            brand.includes(query) ||
            productCategory.includes(query)
          );
        })
    );
  }, [
    products,
    category,
    searchQuery,
    selectedBrands,
    selectedRating,
    inStock,
    priceMax,
  ]);

  return {
    filteredProducts,
  };
}
