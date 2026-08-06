// utils/getProductBadge.js

export default function getProductBadge(product) {
  const { regularPrice, discountPrice, tags = [] } = product;

  const hasDiscount = discountPrice && discountPrice < regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100)
    : 0;

  if (hasDiscount) {
    return { type: "discount", label: `-${discountPercent}%` };
  }
  if (tags.includes("flash")) {
    return { type: "flash", label: "Flash Sale" };
  }
  if (tags.includes("new")) {
    return { type: "new", label: "Baru" };
  }
  if (tags.includes("best")) {
    return { type: "best", label: "Best Seller" };
  }
  if (tags.includes("star-seller")) {
    return { type: "star-seller", label: "Star Seller" };
  }
  if (tags.includes("free-shipping")) {
    return { type: "free-shipping", label: "Gratis Ongkir" };
  }

  return null; // produk tanpa badge tetap valid
}
