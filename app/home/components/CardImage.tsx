import React from "react";

interface CardImageProps {
  images?: string | string[];
  name?: string;
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
        <img
          src={imageArray[0]}
          alt={name || "Image"}
          className="object-contain w-full h-full"
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
