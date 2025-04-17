import { Product, ProductFormValues } from "@/app/types/product";

const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL;

export const productApi = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch the products");
    }

    const { products } = await res.json();

    return products;
  },

  async createOrUpdate(
    product: ProductFormValues & { images: string[] },
    id?: string
  ) {
    const url = id ? `${API_URL}/product/${id}` : `${API_URL}/product`;
    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Failed to save product");
    return response.json();
  },

  // async uploadImage(file: File): Promise<string> {
  //   const formData = new FormData();
  //   formData.append("myFile", file);

  //   console.log(file);

  //   const response = await fetch(`${API_URL}/product/uploadImage`, {
  //     method: "POST",
  //     credentials: "include",
  //     body: formData,
  //   });

  //   const data = await response.json();
  //   return data.imageUrl;
  // },
};
