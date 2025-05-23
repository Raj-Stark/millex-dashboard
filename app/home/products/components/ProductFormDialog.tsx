"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

import { ProductFormDialogProps, ProductFormValues } from "@/app/types/product";
import { ProductImageUpload } from "../../components/ImageUpload";
import { useProductForm } from "../../hooks/useProductForm";

export const ProductFormDialog = ({
  product,
  onSuccess,
  children,
}: ProductFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null);

  const {
    form,
    handleSubmit,
    images,
    uploadImages,
    removeImage,
    isUploading,
    categories,
    isLoadingCategories,
    subcategories,
    isLoadingSubcategories,
  } = useProductForm(product);

  // Pre-fill parent category when editing
  useEffect(() => {
    if (product?.category?._id) {
      setParentCategoryId(product.category._id);
    }
  }, [product]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await handleSubmit({
        ...values,
        categoryId: parentCategoryId || values.categoryId,
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

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
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="product-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price + Inventory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category + Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={parentCategoryId ?? ""}
                  onValueChange={(value) => {
                    setParentCategoryId(value);
                    form.setValue("categoryId", value); // for fallback
                    form.setValue("subCategoryId", ""); // reset subcategory
                  }}
                  disabled={isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {subcategories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingSubcategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((sub: any) => (
                              <SelectItem key={sub._id} value={sub._id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            </div>

            {/* Images */}
            <FormItem>
              <FormLabel>Images</FormLabel>
              <ProductImageUpload
                images={images}
                onUpload={async (files) => {
                  const uploaded = await uploadImages(files);
                  const updatedImages = [...images, ...uploaded];
                  form.setValue("images", updatedImages, {
                    shouldValidate: true,
                  });
                  return uploaded;
                }}
                onRemove={(index) => {
                  const updated = images.filter((_, i) => i !== index);
                  form.setValue("images", updated, { shouldValidate: true });
                  removeImage(index);
                }}
              />
              <FormField
                control={form.control}
                name="images"
                render={() => <FormMessage />}
              />
            </FormItem>

            {/* Featured + Free Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Featured</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeShipping"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Free Shipping</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || isLoadingCategories}
              >
                {isUploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
