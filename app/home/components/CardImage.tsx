import React from "react";
import Image from "next/image";

interface ProductImageProps {
  images?: string[];
  name?: string;
}

const CardImage: React.FC<ProductImageProps> = ({ images, name }) => {
  if (images && images.length > 0) {
    return (
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={images[0]}
          alt={name || "Product image"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
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
