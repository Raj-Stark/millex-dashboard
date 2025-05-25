import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImageUpload } from "./useImageUpload";
import {
  Product,
  productFormSchema,
  ProductFormValues,
} from "@/app/types/product";
import { toast } from "react-toastify";
import { useEffect } from "react";
export const useProductForm = (product?: Product) => {
  const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL || "";
  const isEditing = !!product;
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      categoryId: product?.category?._id || "", // This is good for initial render
      subCategoryId: product?.subcategory?._id || "", // This is good for initial render
      inventory: product?.inventory ?? 0,
      featured: product?.featured ?? false,
      freeShipping: product?.freeShipping ?? false,
      images: product?.images || [],
    },
  });

  useEffect(() => {
    if (product?.category?._id && form.getValues("categoryId") === "") {
      form.setValue("categoryId", product.category._id, {
        shouldValidate: true,
      });
    }
    if (product?.subcategory?._id && form.getValues("subCategoryId") === "") {
      form.setValue("subCategoryId", product.subcategory._id, {
        shouldValidate: true,
      });
    }
  }, [product, form]);

  const { images, setImages, uploadImages, removeImage, isUploading } =
    useImageUpload(product?.images);

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await fetch(`${API_URL}product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Product creation failed.");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues & { _id: string }) => {
      const res = await fetch(`${API_URL}product/${data._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Product update failed.");
    },
  });

  const categoryIdWatched = form.watch("categoryId");

  const handleSubmit = async (values: ProductFormValues) => {
    const basePayload: ProductFormValues = {
      ...values,
      images,
    };

    try {
      if (isEditing && product?._id) {
        await updateProductMutation.mutateAsync({
          ...basePayload,
          _id: product._id,
        });
      } else {
        await createProductMutation.mutateAsync(basePayload);
      }
    } catch {
      // handled by onError
    }
  };

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}categories`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data.categories;
    },
  });

  const { data: subcategories = [], isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ["subcategories", categoryIdWatched],
      queryFn: async () => {
        const selectedCategory = categories.find(
          (cat: any) => cat._id === categoryIdWatched
        );
        if (!selectedCategory?.slug) return [];

        const res = await fetch(
          `${API_URL}categories/parent/${selectedCategory.slug}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.categories;
      },
      enabled: !!categoryIdWatched && !isLoadingCategories,
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
    subcategories,
    isLoadingSubcategories,
  };
};
