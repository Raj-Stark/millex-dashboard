import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";

// Form schema
const subCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image is required"),
});

export type SubCategoryFormValues = z.infer<typeof subCategoryFormSchema>;

interface UseSubCategoryFormOptions {
  parentSlug: string;
  subcategory?: { _id: string; name: string; slug: string; image: string };
}

export const useSubCategoryForm = ({
  parentSlug,
  subcategory,
}: UseSubCategoryFormOptions) => {
  const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL || "";
  const isEditing = !!subcategory;
  const queryClient = useQueryClient();

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      name: subcategory?.name || "",
      slug: subcategory?.slug || "",
      image: subcategory?.image || "",
    },
  });

  const createSubCategoryMutation = useMutation({
    mutationFn: async (data: SubCategoryFormValues) => {
      const res = await fetch(`${API_URL}categories/parent/${parentSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Subcategory creation failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", parentSlug],
      });
      toast.success("Subcategory created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Subcategory creation failed.");
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: async (data: SubCategoryFormValues & { _id: string }) => {
      const res = await fetch(`${API_URL}categories/${data._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Subcategory update failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", parentSlug],
      });
      toast.success("Subcategory updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Subcategory update failed.");
    },
  });

  const handleSubmit = async (values: SubCategoryFormValues) => {
    try {
      if (isEditing && subcategory?._id) {
        await updateSubCategoryMutation.mutateAsync({
          ...values,
          _id: subcategory._id,
        });
      } else {
        await createSubCategoryMutation.mutateAsync(values);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading:
      createSubCategoryMutation.isPending ||
      updateSubCategoryMutation.isPending,
  };
};
