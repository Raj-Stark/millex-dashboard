import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL || "";

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete category");
      }

      return res.json();
    },
    onSuccess: async () => {
      toast.success("Category deleted successfully");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
};
