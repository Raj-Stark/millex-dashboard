import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/app/types/product";
import React from "react";

import CardImage from "../../components/CardImage";
import { ProductFormDialog } from "./ProductFormDialog";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Card key={product._id} className="hover:shadow-xl transition-all">
      <CardHeader>
        <CardImage images={product.images} name={product.name} />
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
  );
}
