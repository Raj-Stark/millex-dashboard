"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+
import { useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies (auth) are included
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json(); // expecting { products: [...] }
    },
  });

  if (isLoading) {
    return <div className="p-5">Loading products...</div>;
  }

  if (isError) {
    return (
      <div className="p-5 text-red-500">
        Failed to load products. Please try again later.
        <br />
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const products = data?.products || []; // Add a check for data being undefined

  return (
    <>
      <div className="px-5">
        <ProductFormDialog>
          <Button>Create Product</Button>
        </ProductFormDialog>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && <ProductCard products={products} />}
      </div>
    </>
  );
}
