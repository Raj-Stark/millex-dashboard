"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/app/types/categoty";
import CategoryCard from "../components/CategoryCard";
import { Button } from "@/components/ui/button";
import Spinner from "../../components/Spinner";
import { SubCategoryFormDialog } from "./components/SubcategoryFormDialog";

export default function SubCategoriesPage() {
  const { subcategories: parentSlug } = useParams();

  const {
    data: subCategories,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subcategories", parentSlug],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}categories/parent/${parentSlug}`,
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
    return <p className="text-red-500 px-5">{(error as Error).message}</p>;

  return (
    <div className="w-full px-5 py-3">
      <div className="mb-6">
        <SubCategoryFormDialog
          parentSlug={parentSlug as string}
          onSuccess={refetch}
        >
          <Button>Create Sub-Category</Button>
        </SubCategoryFormDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories?.map((category: Category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
