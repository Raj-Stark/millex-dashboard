import { useState } from "react";
import { productApi } from "../api/productApi";
import { useMutation } from "@tanstack/react-query";

export const useImageUpload = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const { mutateAsync: uploadSingleImage, isPending: isUploading } =
    useMutation({
      mutationFn: (file: File) => productApi.uploadImage(file),
    });

  const handleImageUpload = (files: FileList, maxCount = 10) => {
    const newFiles = Array.from(files).slice(
      0,
      maxCount - images.length - filesToUpload.length
    );
    setFilesToUpload((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setFilesToUpload((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async () => {
    if (filesToUpload.length === 0) return [];

    try {
      const uploadedUrls = await Promise.all(
        filesToUpload.map((file) => uploadSingleImage(file))
      );
      setImages((prev) => [...prev, ...uploadedUrls]);
      setFilesToUpload([]);
      return uploadedUrls;
    } catch (err) {
      console.error("Image upload failed", err);
      return [];
    }
  };

  return {
    images,
    filesToUpload,
    isUploading,
    handleImageUpload,
    removeImage,
    uploadImages,
    setImages,
  };
};
