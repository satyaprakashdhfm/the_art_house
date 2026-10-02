"use client";

import { Heart } from "lucide-react";
import { useWishlist, wishlistActions } from "@/context/wishlist";
import { ui } from "@/context/ui";

export default function WishlistButton({ productId, className = "" }: { productId: string; className?: string }) {
  const saved = useWishlist().includes(productId);
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        const added = wishlistActions.toggle(productId);
        ui.toast(added ? "Saved to wishlist" : "Removed from wishlist");
      }}
      className={className}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-sale text-sale" : ""}`} />
    </button>
  );
}
