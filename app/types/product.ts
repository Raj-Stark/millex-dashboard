import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().min(1, "Subcategory is required"),
  inventory: z.number().min(0, "Inventory must be at least 0"),
  featured: z.boolean(),
  freeShipping: z.boolean(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  inventory: number;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
  featured: boolean;
  freeShipping: boolean;
}

export interface ProductFormDialogProps {
  product?: Product;
  onSuccess?: () => void;
  children?: React.ReactNode;
}
