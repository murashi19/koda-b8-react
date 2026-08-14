import { useMemo } from "react";

export default function useProductFilter(
  products = [],
  category,
  selectedBrands = [],
  selectedRating = null,
  inStock = false,
  priceMax = 20000000,
) {
  const filteredProducts = useMemo(() => {
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
    );
  }, [products, category, selectedBrands, selectedRating, inStock, priceMax]);

  return {
    filteredProducts,
  };
}
