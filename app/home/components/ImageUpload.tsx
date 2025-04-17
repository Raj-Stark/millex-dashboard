"use client";

import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ProductImageUploadProps {
  images: string[];
  filesToUpload: File[];
  onUpload: (files: FileList) => void;
  onRemove: (index: number, isNew: boolean) => void;
  maxCount?: number;
}

export const ProductImageUpload = ({
  images,
  filesToUpload,
  onUpload,
  onRemove,
  maxCount = 10,
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) onUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        multiple
        accept="image/*"
        className="hidden"
      />

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {`Upload up to ${
            maxCount - images.length - filesToUpload.length
          } more images`}
        </p>
      </div>

      {(images.length > 0 || filesToUpload.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <ImagePreview
              key={`existing-${index}`}
              src={img}
              alt={`Product image ${index + 1}`}
              onRemove={() => onRemove(index, false)}
            />
          ))}
          {filesToUpload.map((file, index) => (
            <ImagePreview
              key={`new-${index}`}
              src={URL.createObjectURL(file)}
              alt={`New image ${index + 1}`}
              onRemove={() => onRemove(index, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ImagePreview = ({
  src,
  alt,
  onRemove,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
}) => (
  <div className="relative group">
    <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        className="object-cover w-full h-full"
      />
    </div>
    <Button
      type="button"
      variant="destructive"
      size="icon"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onRemove}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
