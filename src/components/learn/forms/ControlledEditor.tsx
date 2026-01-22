import { forwardRef, useEffect, useRef } from "react";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { MinimalToolbar } from "./MinimalToolbar";

interface ControlledEditorProps {
  value?: string | null;
  onChange?: (content: string) => void;
}

export const ControlledEditor = forwardRef<any, ControlledEditorProps>(
  ({ value, onChange }, ref) => {
    const editorInstanceRef = useRef<any>(null);

    const editor = useEditor({
      immediatelyRender: false,
      content: value || "",
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          "aria-label": "Lesson content editor",
          class:
            "tiptap focus:outline-none prose prose-lg max-w-none w-full p-6 " +
            "prose-headings:font-bold prose-headings:text-gray-900 " +
            "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 " +
            "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline " +
            "prose-strong:text-gray-900 prose-strong:font-semibold " +
            "prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4 " +
            "prose-li:text-gray-700 prose-li:my-1 " +
            "prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded " +
            "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:my-4 " +
            "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 " +
            "prose-img:rounded-lg prose-img:shadow-md prose-img:my-4 " +
            "[&_p:empty]:h-6",
        },
      },
      onUpdate: ({ editor }) => {
        // Get HTML and preserve empty paragraphs by ensuring they have proper spacing
        const html = editor.getHTML();
        // Replace empty paragraphs with paragraphs containing line break for proper spacing
        const preservedHtml = html.replaceAll(/<p><\/p>/g, "<p><br></p>");
        onChange?.(preservedHtml);
      },
      extensions: [
        StarterKit.configure({
          horizontalRule: false,
          link: {
            openOnClick: false,
            enableClickSelection: true,
          },
        }),
        HorizontalRule,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Image,
        Typography,
        Superscript,
        Subscript,
        Selection,
        ImageUploadNode.configure({
          accept: "image/*",
          maxSize: MAX_FILE_SIZE,
          limit: 3,
          upload: handleImageUpload,
          onError: (error) => console.error("Upload failed:", error),
        }),
      ],
    });

    useEffect(() => {
      editorInstanceRef.current = editor;
      if (ref) {
        if (typeof ref === "function") {
          ref(editor);
        } else {
          ref.current = editor;
        }
      }
    }, [editor, ref]);

    useEffect(() => {
      if (editor && value && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    if (!editor) {
      return <div className="h-full bg-gray-50 rounded animate-pulse" />;
    }

    return (
      <EditorContext.Provider value={{ editor }}>
        <div className="flex flex-col h-full bg-white border border-gray-300 rounded-md overflow-hidden">
          <MinimalToolbar />
          <div className="flex-1 overflow-y-auto bg-white">
            <EditorContent editor={editor} className="h-full" />
          </div>
        </div>
      </EditorContext.Provider>
    );
  }
);

ControlledEditor.displayName = "ControlledEditor";
