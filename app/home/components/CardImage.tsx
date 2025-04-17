// components/ProductImage.tsx
import React from "react";

interface ProductImageProps {
  images?: string[];
  name?: string;
}

const CardImage: React.FC<ProductImageProps> = ({ images, name }) => {
  if (images && images.length > 0) {
    return (
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={images[0]}
          alt={name || "Product image"}
          className="object-contain w-full h-full"
          style={{ maxHeight: "100%" }}
        />
      </div>
    );
  } else {
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span>No Image</span>
      </div>
    );
  }
};

export default CardImage;
