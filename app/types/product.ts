import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface Product {
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

export interface ProductFormDialogProps {
  product?: Product;
  onSuccess?: () => void;
  children?: React.ReactNode;
}
