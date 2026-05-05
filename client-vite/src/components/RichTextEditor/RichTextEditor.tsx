import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { ResizableImage } from "./ResizableImage";
import { Toolbar } from "./Toolbar";
import { BubbleMenuContent } from "./BubbleMenuContent";
import "./RichTextEditor.scss";

export interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  onUpload?: (file: File) => Promise<string>;
}

export const RichTextEditor = ({
  content = "",
  placeholder = "Type something…",
  onChange,
  onUpload,
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onUploadRef = useRef(onUpload);
  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      handleDrop: (view, event) => {
        const dragEvent = event as DragEvent;
        const files = Array.from(dragEvent.dataTransfer?.files ?? []).filter(
          (f) => f.type.startsWith("image/"),
        );
        if (!files.length || !onUploadRef.current) return false;
        dragEvent.preventDefault();
        const coordPos = view.posAtCoords({ left: dragEvent.clientX, top: dragEvent.clientY });
        files.forEach(async (file) => {
          const url = await onUploadRef.current!(file);
          const node = view.state.schema.nodes.image?.create({ src: url });
          if (!node) return;
          view.dispatch(view.state.tr.insert(coordPos?.pos ?? view.state.doc.content.size, node));
        });
        return true;
      },
      handlePaste: (view, event) => {
        const clipEvent = event as ClipboardEvent;
        const items = Array.from(clipEvent.clipboardData?.items ?? []).filter(
          (item) => item.type.startsWith("image/"),
        );
        if (!items.length || !onUploadRef.current) return false;
        items.forEach(async (item) => {
          const file = item.getAsFile();
          if (!file || !onUploadRef.current) return;
          const url = await onUploadRef.current(file);
          const node = view.state.schema.nodes.image?.create({ src: url });
          if (!node) return;
          view.dispatch(view.state.tr.replaceSelectionWith(node));
        });
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor || content === editor.getHTML()) return;
    editor.commands.setContent(content ?? "");
  }, [content, editor]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;
    event.target.value = "";
    const url = await onUpload(file);
    editor?.chain().focus().insertContent({ type: "image", attrs: { src: url } }).run();
  };

  return (
    <div className="rte">
      {editor && (
        <>
          <Toolbar
            editor={editor}
            onFileClick={onUpload ? () => fileInputRef.current?.click() : undefined}
          />
          <BubbleMenu editor={editor} className="rte-bubble-menu">
            <BubbleMenuContent editor={editor} />
          </BubbleMenu>
        </>
      )}

      <div className="rte-content">
        <EditorContent editor={editor} />
      </div>

      {onUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      )}
    </div>
  );
};
