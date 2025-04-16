"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ProductFormDialog } from "./product-form-dialog";

interface ProductCardProps {
  products: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    images: string[];
    category?: {
      name: string;
    };
  }[];
}

function ProductCard({ products }: ProductCardProps) {
  const getCleanDescription = (description?: string) => {
    if (!description) return "No description available";

    try {
      const cleanText = description
        .replace(/[*#_`~]/g, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const words = cleanText
        .split(" ")
        .filter((word) => word.length > 0)
        .slice(0, 15);
      return words.join(" ") + (words.length === 15 ? "..." : "");
    } catch (error) {
      return "Description unavailable";
    }
  };

  return (
    <>
      {products.map((product) => (
        <Card
          key={product._id}
          className="hover:shadow-xl transition-all gap-0.5"
        >
          <CardHeader className="p-0">
            {product.images?.length > 0 ? (
              <div className="relative w-full h-48">
                <Image
                  src={product.images[0]}
                  alt={product.name || "Product image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span>No Image</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-4">
            <CardTitle className="text-lg font-semibold">
              {product.name || "Untitled Product"}
            </CardTitle>
            <div className="text-lg font-bold my-2">
              ₹{product.price?.toLocaleString() || "N/A"}
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              {getCleanDescription(product.description)}
            </CardDescription>
            {product.category?.name && (
              <div className="text-xs mt-2 text-muted-foreground">
                Category: {product.category.name}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t gap-3 p-4">
            <ProductFormDialog product={product}>
              <Button className="bg-green-600 hover:bg-green-500">Edit</Button>
            </ProductFormDialog>
            <Button className="bg-red-600 hover:bg-red-500">Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default ProductCard;
