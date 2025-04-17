"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "./components/ProductFormDialog";
import ProductCard from "./components/ProductCard";
import { Product } from "@/app/types/product";

export default function ProductsPage() {
  const {
    data: products,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () =>
      (
        await (
          await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/product`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        ).json()
      ).products,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

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
