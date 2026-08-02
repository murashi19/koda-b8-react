import { useMemo } from "react";

function parsePrice(price) {
  if (!price) return 0;
  return Number(price.replace("Rp", "").replace(/\./g, "").replace(/\s/g, ""));
}

export default function useProductFilter(
  products,
  category,
  searchQuery = "",
  selectedBrands = [],
  selectedRating = null,
  inStock = false,
  priceMax = 20000000,
) {
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => !category || p.category === category)
      .filter((p) => parsePrice(p.discountPrice) <= priceMax)
      .filter(
        (p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand),
      )
      .filter((p) => selectedRating === null || p.rating <= selectedRating)
      .filter((p) => !inStock || p.stock > 0)
      .filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });
  }, [
    products,
    category,
    searchQuery,
    selectedBrands,
    selectedRating,
    inStock,
    priceMax,
  ]);

  return { filteredProducts };
}
