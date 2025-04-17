"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "./components/ProductFormDialog";
import ProductCard from "./components/ProductCard";
import { productApi } from "../api/productApi";

export default function ProductsPage() {
  const {
    data: products,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>{(error as Error).message}</p>;

  console.log(products);

  return (
    <>
      <div className="px-5">
        <ProductFormDialog>
          <Button>Create Product</Button>
        </ProductFormDialog>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
}
