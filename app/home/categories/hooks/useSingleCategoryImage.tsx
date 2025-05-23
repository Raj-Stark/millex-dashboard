import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSingleCategoryImage = () => {
  const API_URL = process.env.NEXT_PUBLIC_LOCAL_URL || "";
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadSingleImage } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("myFile", file);

      const res = await fetch(`${API_URL}categories/upload-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Image upload failed");
      }

      return res.json();
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const result = await uploadSingleImage(file);
      const url = result.imageUrl;
      setImage(url);
      toast.success("Image uploaded!");
      return url;
    } catch {
      toast.error("Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    toast.info("Image removed");
  };

  return {
    image,
    setImage,
    isUploading,
    uploadImage,
    removeImage,
  };
};
