import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  });
};
