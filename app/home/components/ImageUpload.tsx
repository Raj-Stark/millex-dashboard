"use client";

import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ProductImageUploadProps {
  images: string[];
  onUpload: (files: FileList) => Promise<string[]>;
  onRemove: (index: number) => void;
  maxCount?: number;
}

export const ProductImageUpload = ({
  images,
  onUpload,
  onRemove,
  maxCount = 10,
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) await onUpload(e.dataTransfer.files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await onUpload(e.target.files);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {`Upload up to ${maxCount - images.length} more images`}
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <ImagePreview
              key={img}
              src={img}
              alt={`Uploaded image ${index + 1}`}
              onRemove={() => onRemove(index)}
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
