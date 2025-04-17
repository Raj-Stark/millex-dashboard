import { Category } from "@/app/types/categoty";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryApi = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/category/`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.categories;
  },
};
