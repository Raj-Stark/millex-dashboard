import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to upload image");
      }

      return res.json();
    },
  });

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    try {
      const uploadedResponses = await Promise.all(
        fileArray.map((file) =>
          uploadSingleImage(file).catch((err) => {
            toast.error(`Failed to upload ${file.name}`);
            return null;
          })
        )
      );

      const uploadedUrls = uploadedResponses
        .filter((res) => res !== null)
        .flatMap((res) =>
          Array.isArray(res) ? res.map((r) => r.imageUrl) : [res.imageUrl]
        );

      if (uploadedUrls.length > 0) {
        toast.success("Images uploaded successfully!");
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      return uploadedUrls;
    } catch (err) {
      toast.error("An unexpected error occurred during upload.");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image removed");
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
