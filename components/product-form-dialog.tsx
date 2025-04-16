"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import Image from "next/image";
import { Trash2, UploadCloud } from "lucide-react";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
}

interface ProductFormDialogProps {
  product?: Product;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function ProductFormDialog({
  product,
  onSuccess,
  children,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      categoryId: product?.category?._id || "",
    },
  });

  // Editor initialization and change handlers
  useEffect(() => {
    if (open && editorRef.current && !isEditorReady) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(form.getValues("description") || "");
      setIsEditorReady(true);

      const handleEditorChange = () => {
        const markdown = editorInstance.getMarkdown();
        form.setValue("description", markdown, { shouldValidate: true });
      };

      editorInstance.on("change", handleEditorChange);

      return () => {
        editorInstance.off("change", handleEditorChange);
      };
    } else if (!open) {
      setIsEditorReady(false);
    }
  }, [open, form, isEditorReady]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        categoryId: product?.category?._id || "",
      });
      setImages(product?.images || []);
      setFilesToUpload([]);
      setIsEditorReady(false);
      if (!product && editorRef.current) {
        setTimeout(() => {
          editorRef.current?.getInstance().setMarkdown("");
        }, 100);
      }
    }
  }, [open, product, form]);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  async function fetchCategories() {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/category/`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  const handleImageUpload = (files: FileList) => {
    const newFiles = Array.from(files).slice(
      0,
      10 - images.length - filesToUpload.length
    );
    setFilesToUpload((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      // Revoke object URL before removing
      URL.revokeObjectURL(URL.createObjectURL(filesToUpload[index]));
      setFilesToUpload((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file); // Changed from "myFile" to "file" (more standard)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/product/uploadImage`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("Invalid response format - missing URL");
    }

    return data.url;
  };

  const handleCancel = () => {
    form.reset();
    setImages(product?.images || []);
    // Clean up object URLs
    filesToUpload.forEach((file) =>
      URL.revokeObjectURL(URL.createObjectURL(file))
    );
    setFilesToUpload([]);
    setIsEditorReady(false);
    setOpen(false);
  };

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setIsUploading(filesToUpload.length > 0);

    try {
      const editorInstance = editorRef.current?.getInstance();
      const markdownContent = editorInstance?.getMarkdown() || "";

      // First upload all new images
      const uploadedUrls = await Promise.all(
        filesToUpload.map((file) => uploadImageToServer(file))
      );

      // Then prepare the final form data
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", markdownContent);
      formData.append("price", values.price.toString());
      formData.append("categoryId", values.categoryId);

      // Append all image URLs (existing and new)
      [...images, ...uploadedUrls].forEach((url) => {
        formData.append("images", url);
      });

      const url = product
        ? `${process.env.NEXT_PUBLIC_LOCAL_URL}/product/${product._id}`
        : `${process.env.NEXT_PUBLIC_LOCAL_URL}/product`;
      const method = product ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      // You might want to add user feedback here
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      filesToUpload.forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
    };
  }, [filesToUpload]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            {product ? "Edit" : "Create Product"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="max-h-[300px] overflow-y-auto">
                      <Editor
                        ref={editorRef}
                        initialValue={field.value || ""}
                        previewStyle="vertical"
                        height="300px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        onLoad={() => setIsEditorReady(true)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCategories || categories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Loading categories..."
                              : categories.length === 0
                              ? "No categories available"
                              : "Select a category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <FormLabel>Images</FormLabel>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files)
                }
                multiple
                accept="image/*"
                className="hidden"
              />

              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {`Upload up to ${
                    10 - images.length - filesToUpload.length
                  } more images (PNG, JPG, JPEG)`}
                </p>
              </div>

              {/* Image Previews */}
              {(images.length > 0 || filesToUpload.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {/* Existing Images */}
                  {images.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* New Images to be Uploaded */}
                  {filesToUpload.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoadingCategories ||
                  isUploading ||
                  !isEditorReady
                }
              >
                {isSubmitting || isUploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
