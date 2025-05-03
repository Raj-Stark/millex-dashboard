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
import { useState } from "react";

import { ProductFormDialogProps, ProductFormValues } from "@/app/types/product";
import { ProductImageUpload } from "../../components/ImageUpload";
import { useProductForm } from "../../hooks/useProductForm";

export const ProductFormDialog = ({
  product,
  onSuccess,
  children,
}: ProductFormDialogProps) => {
  const [open, setOpen] = useState(false);

  const {
    form,
    handleSubmit,
    images,
    uploadImages,
    removeImage,
    isUploading,
    categories,
    isLoadingCategories,
  } = useProductForm(product);

  const onSubmit = async (values: ProductFormValues) => {
    console.log("Form Values:", values);
    try {
      await handleSubmit(values);
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

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value
                      }
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
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value
                      }
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

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
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
