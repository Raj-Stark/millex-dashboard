"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CategoryCard from "./components/CategoryCard";
import { Category } from "@/app/types/categoty";
import Spinner from "../components/Spinner";

export default function CategoriesPage() {
  const {
    data: categories,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (
        await (
          await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/category`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        ).json()
      ).categories,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p className="px-10 py-3">{(error as Error).message}</p>;

  return (
    <div className="px-5 py-3 w-full">
      <div className="px-5 ">
        <Button>Create Category</Button>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category: Category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
