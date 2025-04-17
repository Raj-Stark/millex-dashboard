"use client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useEffect, useRef } from "react";

interface ProductEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export const ProductEditor = ({
  initialValue,
  onChange,
}: ProductEditorProps) => {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    const editor = editorRef.current?.getInstance();
    if (editor && onChange) {
      editor.on("change", () => {
        onChange(editor.getMarkdown());
      });
    }
  }, [onChange]);

  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Editor
        ref={editorRef}
        initialValue={initialValue || ""}
        previewStyle="vertical"
        height="300px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
      />
    </div>
  );
};
