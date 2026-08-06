import { Heart, ImageIcon, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import StarRating from "@/components/common/StarsRate";
import useCart from "@/features/cart/useCart";
import useWishlist from "@/features/wishlist/useWishlist";
import getProductBadge from "@/utils/getProductBadge";

const BADGE_COLOR = {
  discount: "bg-accent", // merah
  new: "bg-primary", // biru
  flash: "bg-orange-500",
  best: "bg-amber-500",
  "star-seller": "bg-purple-500",
  "free-shipping": "bg-emerald-500",
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const badge = getProductBadge(product);

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
      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
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
        {badge && (
          <span
            className={`absolute top-2 left-2 h-6 min-w-11.25 px-2.5 flex items-center justify-center rounded-full text-xs font-medium text-white ${BADGE_COLOR[badge.type]}`}
          >
            {badge.label}
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-sm transition-colors duration-300 cursor-pointer"
        >
          <Heart
            className="w-4 h-4"
            strokeWidth={1.5}
            stroke={wishlisted ? "#f97316" : "currentColor"}
            fill={wishlisted ? "#f97316" : "none"}
          />
        </button>
      </div>
      <div className="flex flex-col flex-1 gap-2 p-4">
        <p className="text-xs text-text-secondary">{product.brand}</p>
        <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-sm text-text-primary font-medium">
            {product.rating}
          </span>
          <span className="text-xs text-text-secondary">
            ({product.review})
          </span>
        </div>
        {product.discountPrice != 0 ? (
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-base font-bold text-primary">
              {product.discountPriceFormatted}
            </span>
            {product.regularPrice && (
              <span className="text-xs text-text-secondary line-through">
                {product.regularPriceFormatted}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-base font-bold text-primary">
              {product.regularPrice}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-1 flex items-center justify-center gap-2 w-full h-9 rounded-lg btn-primary text-sm font-medium cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
