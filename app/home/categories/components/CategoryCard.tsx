"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CardImage from "../../components/CardImage";
import AlertBox from "../../components/AlertBox";
import { Category } from "@/app/types/categoty";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { SubCategoryFormDialog } from "../[subcategories]/components/SubcategoryFormDialog";

interface CategoryCardProps {
  category: Category;
  parentSlug?: string;
  onSuccess?: () => void;
}

export default function CategoryCard({
  category,
  parentSlug,
  onSuccess,
}: CategoryCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const productDescription =
    "This action cannot be undone. This will permanently delete your category and remove your data from our servers.";

  const handleCardClick = () => {
    if (pathname === "/home/categories") {
      router.push(`/home/categories/${category.slug}`);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all cursor-pointer">
      <CardHeader onClick={handleCardClick}>
        <CardImage images={category.image} name={category.name} />
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg font-semibold">
          {category.name || "Untitled Category"}
        </CardTitle>
        <div className="text-xs mt-2">
          <span className="font-semibold text-muted-foreground">
            Category Slug:
          </span>{" "}
          {category.slug}
        </div>
      </CardContent>

      <CardFooter className="border-t gap-3 z-10 relative">
        <SubCategoryFormDialog
          parentSlug={parentSlug || category.slug}
          subcategory={category}
          onSuccess={onSuccess}
        >
          <Button
            className="bg-green-600 hover:bg-green-500"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Button>
        </SubCategoryFormDialog>

        <AlertBox
          description={productDescription}
          onConfirm={() => deleteCategory(category._id)}
        >
          <Button
            className="bg-red-600 hover:bg-red-500"
            onClick={(e) => e.stopPropagation()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertBox>
      </CardFooter>
    </Card>
  );
}
