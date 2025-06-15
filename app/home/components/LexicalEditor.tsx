"use client";

import { useCallback, useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { EditorState, $getRoot, $createParagraphNode } from "lexical";
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

// Required nodes and plugins
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

interface LexicalEditorProps {
  initialMarkdown?: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  title,
  children,
  active = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={handleClick}
      title={title}
      className="h-8 w-8 p-0"
      type="button"
    >
      {children}
    </Button>
  );
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (type: "bullet" | "number") => {
    editor.dispatchCommand(
      type === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg"
      onClick={(e) => e.preventDefault()}
    >
      <ToolbarButton onClick={() => formatText("bold")} title="Bold (Ctrl+B)">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("underline")}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolbarButton onClick={() => insertList("bullet")} title="Bullet List">
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => insertList("number")} title="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
};

export function LexicalEditor({
  initialMarkdown = "",
  onChange,
  placeholder = "Enter description...",
}: LexicalEditorProps) {
  const editorRef = useRef(null);
  const isInitializedRef = useRef(false);

  const editorConfig = {
    namespace: "SimpleEditor",
    theme: {
      root: "p-0 border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent",
      text: {
        bold: "font-semibold",
        italic: "italic",
        underline: "underline",
      },
      paragraph: "mb-2 last:mb-0",
      list: {
        ul: "list-disc pl-6 my-2",
        ol: "list-decimal pl-6 my-2",
        listitem: "list-item",
      },
      link: "text-blue-600 underline",
      code: "bg-gray-100 font-mono p-1 rounded",
    },
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
  };

  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (!isInitializedRef.current) return;

      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange(markdown);
      });
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <LexicalComposer initialConfig={editorConfig}>
        <MarkdownInitializer
          initialMarkdown={initialMarkdown}
          editorRef={editorRef}
          onInitialized={() => (isInitializedRef.current = true)}
        />
        <Toolbar />
        <div className="relative px-4 py-2">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[200px] outline-none [&>div]:mb-2"
                spellCheck={false}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={() => (
              <div>Something went wrong with the editor.</div>
            )}
          />
        </div>
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </LexicalComposer>
    </div>
  );
}

function MarkdownInitializer({
  initialMarkdown,
  editorRef,
  onInitialized,
}: {
  initialMarkdown: string;
  editorRef: React.RefObject<any>;
  onInitialized: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = true;

    editor.update(() => {
      const root = $getRoot();

      // Clear existing content
      if (root.getFirstChild() !== null) {
        root.clear();
      }

      if (initialMarkdown) {
        $convertFromMarkdownString(initialMarkdown, TRANSFORMERS);
      } else {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
      }

      onInitialized();
    });
  }, [editor, initialMarkdown, editorRef, onInitialized]);

  return null;
}
