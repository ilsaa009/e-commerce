// components/Skeleton.js
import React from "react";

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// Individual Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4 shadow-md w-60 h-80`}
    >
      <div className="flex flex-col items-center">
        {/* Image Placeholder */}
        <div className="h-36 w-36 bg-gray-200 rounded-md mb-4" />
        {/* Title Placeholder */}
        <div className="h-6 w-32 bg-gray-200 rounded-md mb-2" />
        {/* Price Placeholder */}
        <div className="h-6 w-20 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

// Skeleton for multiple Product Cards
export function ProductCardsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </div>
  );
}

export default ProductCardsSkeleton;
