import { Heart, ImageIcon, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import StarRating from "./StarsRate";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/detail-page/${product.id}`}
      className="flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <span
          className={`absolute top-2 left-2 h-6 min-w-11.25 px-2.5 flex items-center justify-center rounded-full text-xs text-white ${product.badgeType === "new" ? "bg-[#1a73e8]" : "bg-red-600"}`}
        >
          {product.badge}
        </span>
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className="w-4 h-4"
            strokeWidth={1.5}
            stroke={wishlisted ? "#dc2626" : "currentColor"}
            fill={wishlisted ? "#dc2626" : "none"}
          />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-xs text-gray-500">{product.brand}</p>
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.review})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold text-[#1a73e8]">
            {product.discountPrice}
          </span>
          {product.regularPrice && (
            <span className="text-xs text-gray-500 line-through">
              {product.regularPrice}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-1 flex items-center justify-center gap-2 w-full h-9 rounded-lg bg-[#1a73e8] text-white text-sm font-medium hover:bg-[#1558b0] transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
