import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CardImage from "../../components/CardImage";
import AlertBox from "../../components/AlertBox";
import { useDeleteProduct } from "../../hooks/useDeleteProduc";
import { CategorieFormDialog } from "./CategorieFormDialog";
import { Category } from "@/app/types/categoty";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const productDescription =
    "This action cannot be undone. This will permanently delete your product and remove your data from our servers.";

  return (
    <Card key={category._id} className=" hover:shadow-xl transition-all">
      <CardHeader>
        <CardImage images={category.image} name={category.name} />
      </CardHeader>

      <CardContent className="">
        <CardTitle className="text-lg font-semibold">
          {category.name || "Untitled Product"}
        </CardTitle>
        <div className="text-xs mt-2 ">
          <span className="font-semibold text-muted-foreground">
            Category Slug:
          </span>{" "}
          {category.slug}
        </div>
      </CardContent>

      <CardFooter className="border-t gap-3 ">
        <CategorieFormDialog>
          <Button className="bg-green-600 hover:bg-green-500">Edit</Button>
        </CategorieFormDialog>

        <AlertBox
          description={productDescription}
          onConfirm={() => deleteProduct(category._id)}
        >
          <Button className="bg-red-600 hover:bg-red-500">
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertBox>
      </CardFooter>
    </Card>
  );
}
