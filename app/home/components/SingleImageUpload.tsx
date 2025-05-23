"use client";

import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface SingleImageUploadProps {
  image: string | null;
  onUpload: (file: File) => Promise<string | null>;
  onRemove: () => void;
}

export const SingleImageUpload = ({
  image,
  onUpload,
  onRemove,
}: SingleImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!image ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onClick={triggerFileInput}
        >
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Click to upload image</p>
        </div>
      ) : (
        <div className="relative group w-40">
          <Image
            src={image}
            alt="Category Image"
            width={200}
            height={200}
            className="rounded-md object-cover"
          />
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
      )}
    </div>
  );
};
