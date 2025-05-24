"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CategoryCard from "./components/CategoryCard";
import Spinner from "../components/Spinner";
import { Category } from "@/app/types/categoty";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();

  const {
    data: categories,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}categories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await response.json();
      return result.categories;
    },
  });

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <p className="px-10 py-3 text-red-500">{(error as Error).message}</p>
    );

  return (
    <div className="w-full px-10 py-3">
      <div className="mb-6">
        <Button>Create Category</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category: Category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
