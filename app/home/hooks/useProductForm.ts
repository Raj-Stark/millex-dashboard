// In hooks/useProductForm.ts

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { useImageUpload } from "./useImageUpload";
import {
  Product,
  productFormSchema,
  ProductFormValues,
} from "@/app/types/product";

export const useProductForm = (product?: Product) => {
  const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL;
  const isEditing = !!product; // Check if we are editing
  const queryClient = useQueryClient(); // Get the query client instance

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      categoryId: product?.category?._id || "",
      inventory: product?.inventory ?? 0,
      featured: product?.featured ?? false,
      freeShipping: product?.freeShipping ?? false,
      images: product?.images || [],
    },
  });

  const { images, setImages, uploadImages, removeImage, isUploading } =
    useImageUpload(product?.images);

  // Mutation for creating a new product
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await fetch("api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Product creation failed");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate the products query after successful creation
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation for updating an existing product
  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues & { _id: string }) => {
      const res = await fetch(`api/update-product`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Product update failed");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate the products query after successful update
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    const basePayload: ProductFormValues = {
      ...values,
      images,
    };

    if (isEditing && product?._id) {
      const updatePayload: ProductFormValues & { _id: string } = {
        ...basePayload,
        _id: product._id,
      };
      await updateProductMutation.mutateAsync(updatePayload);
    } else {
      await createProductMutation.mutateAsync(basePayload);
    }
  };

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}category/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data.categories;
    },
  });

  return {
    form,
    handleSubmit,
    images,
    setImages,
    uploadImages,
    removeImage,
    isUploading,
    categories,
    isLoadingCategories,
    categoryError,
  };
};
