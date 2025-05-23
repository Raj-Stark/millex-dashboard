"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubCategoryForm } from "../../hooks/useSubcategoryForm";
import { useSingleCategoryImage } from "../../hooks/useSingleCategoryImage";
import { SingleImageUpload } from "@/app/home/components/SingleImageUpload";
import { Category } from "@/app/types/categoty";

interface Props {
  parentSlug: string;
  subcategory?: Category;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function SubCategoryFormDialog({
  parentSlug,
  subcategory,
  onSuccess,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const { form, handleSubmit, isLoading } = useSubCategoryForm({
    parentSlug,
    subcategory,
  });

  const { image, uploadImage, removeImage, isUploading, setImage } =
    useSingleCategoryImage();

  // Set initial image in edit mode
  useEffect(() => {
    if (subcategory?.image) {
      setImage(subcategory.image);
    }
  }, [subcategory, setImage]);

  const handleDialogSubmit = async () => {
    if (!image) {
      form.setError("image", { message: "Image is required" });
      return;
    }

    form.setValue("image", image, { shouldValidate: true });

    await form.handleSubmit(async (values) => {
      await handleSubmit(values);
      setOpen(false);
      onSuccess?.();
    })();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>{subcategory ? "Edit" : "Create"} Subcategory</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subcategory ? "Edit" : "Create"} Subcategory
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Mini Tiller" />
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
                    <Input {...field} placeholder="e.g. mini-tiller" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <SingleImageUpload
                    image={image}
                    onUpload={async (file) => {
                      const url = await uploadImage(file);
                      if (url) {
                        form.setValue("image", url, { shouldValidate: true });
                      }
                      return url;
                    }}
                    onRemove={() => {
                      removeImage();
                      form.setValue("image", "", { shouldValidate: true });
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading || isUploading
                  ? "Saving..."
                  : subcategory
                  ? "Update"
                  : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
