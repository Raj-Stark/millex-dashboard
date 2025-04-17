import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const useImageUpload = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadSingleImage } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("myFile", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      return res.json();
    },
  });

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    const uploadedResponses = await Promise.all(
      fileArray.map((file) => uploadSingleImage(file))
    );

    const uploadedUrls = uploadedResponses.flatMap((res) =>
      Array.isArray(res) ? res.map((r) => r.imageUrl) : [res.imageUrl]
    );

    setImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
    return uploadedUrls;
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    images,
    setImages,
    uploadImages,
    removeImage,
    isUploading,
    uploadSingleImage,
  };
};
