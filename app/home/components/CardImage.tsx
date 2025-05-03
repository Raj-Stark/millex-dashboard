import React from "react";
import Image from "next/image";

interface CardImageProps {
  images: string | string[];
  name: string;
}

const CardImage: React.FC<CardImageProps> = ({ images, name }) => {
  const imageArray = images
    ? typeof images === "string"
      ? [images]
      : images
    : [];

  if (imageArray.length > 0) {
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
  }

  return (
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span>No Image</span>
    </div>
  );
};

export default CardImage;
