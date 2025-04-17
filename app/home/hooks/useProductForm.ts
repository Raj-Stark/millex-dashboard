import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productApi } from "../api/productApi";
import { useImageUpload } from "./useImageUpload";
import { useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import {
  Product,
  productFormSchema,
  ProductFormValues,
} from "@/app/types/product";

export const useProductForm = (product?: Product) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      categoryId: product?.category?._id || "",
    },
  });

  const editorRef = useRef<Editor>(null);
  const imageUpload = useImageUpload(product?.images);

  const initializeEditor = () => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.setMarkdown(form.getValues("description"));

      editor.on("change", () => {
        form.setValue("description", editor.getMarkdown());
      });
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const uploadedImages = await imageUpload.uploadImages();
    const allImages = [...imageUpload.images, ...uploadedImages];

    return productApi.createOrUpdate(
      { ...values, images: allImages },
      product?._id
    );
  };

  return {
    form,
    editorRef,
    initializeEditor,
    handleSubmit,
    ...imageUpload,
  };
};
