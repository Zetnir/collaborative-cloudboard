import { useEditor, EditorContent, Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import "./RichTextEditor.scss";

export interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];

function getHeadingValue(editor: Editor): string {
  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) return String(level);
  }
  return "0";
}

const Sep = () => <div className="rte-toolbar__sep" />;

function ToolbarBtn({
  active,
  disabled,
  onClick,
  icon,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      className={`rte-toolbar__btn${active ? " is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <i className={`bi ${icon}`} />
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isHighlight: ctx.editor.isActive("highlight"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
      headingValue: getHeadingValue(ctx.editor),
    }),
  });

  const setHeading = (value: string) => {
    if (value === "0") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .setHeading({ level: Number(value) as HeadingLevel })
        .run();
    }
  };

  return (
    <div className="rte-toolbar">
      <select
        className="rte-toolbar__select"
        value={state.headingValue}
        onChange={(e) => setHeading(e.target.value)}
        title="Text style"
      >
        <option value="0">Normal text</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <Sep />

      <ToolbarBtn active={state.isBold} onClick={() => editor.chain().focus().toggleBold().run()} icon="bi-type-bold" title="Bold" />
      <ToolbarBtn active={state.isItalic} onClick={() => editor.chain().focus().toggleItalic().run()} icon="bi-type-italic" title="Italic" />
      <ToolbarBtn active={state.isStrike} onClick={() => editor.chain().focus().toggleStrike().run()} icon="bi-type-strikethrough" title="Strikethrough" />
      <ToolbarBtn active={state.isCode} onClick={() => editor.chain().focus().toggleCode().run()} icon="bi-code" title="Inline code" />
      <ToolbarBtn active={state.isHighlight} onClick={() => editor.chain().focus().toggleHighlight().run()} icon="bi-highlighter" title="Highlight" />

      <Sep />

      <ToolbarBtn active={state.isBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()} icon="bi-list-ul" title="Bullet list" />
      <ToolbarBtn active={state.isOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon="bi-list-ol" title="Ordered list" />

      <Sep />

      <ToolbarBtn active={state.isBlockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon="bi-blockquote-left" title="Quote" />
      <ToolbarBtn active={state.isCodeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()} icon="bi-code-square" title="Code block" />
      <ToolbarBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} icon="bi-hr" title="Horizontal rule" />

      <Sep />

      <ToolbarBtn active={state.isAlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()} icon="bi-text-left" title="Align left" />
      <ToolbarBtn active={state.isAlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()} icon="bi-text-center" title="Align center" />
      <ToolbarBtn active={state.isAlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()} icon="bi-text-right" title="Align right" />

      <Sep />

      <ToolbarBtn disabled={!state.canUndo} active={false} onClick={() => editor.chain().focus().undo().run()} icon="bi-arrow-counterclockwise" title="Undo" />
      <ToolbarBtn disabled={!state.canRedo} active={false} onClick={() => editor.chain().focus().redo().run()} icon="bi-arrow-clockwise" title="Redo" />
    </div>
  );
}

// ─── BubbleMenuContent ───────────────────────────────────────────────────────

function BubbleMenuContent({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isHighlight: ctx.editor.isActive("highlight"),
    }),
  });

  return (
    <>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={state.isBold ? "is-active" : ""} title="Bold">
        <i className="bi bi-type-bold" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={state.isItalic ? "is-active" : ""} title="Italic">
        <i className="bi bi-type-italic" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={state.isStrike ? "is-active" : ""} title="Strikethrough">
        <i className="bi bi-type-strikethrough" />
      </button>
      <div className="rte-bubble-menu__sep" />
      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={state.isCode ? "is-active" : ""} title="Inline code">
        <i className="bi bi-code" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={state.isHighlight ? "is-active" : ""} title="Highlight">
        <i className="bi bi-highlighter" />
      </button>
    </>
  );
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

export const RichTextEditor = ({
  content = "",
  placeholder = "Type something…",
  onChange,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="rte">
      {editor && (
        <>
          <Toolbar editor={editor} />

          <BubbleMenu editor={editor} className="rte-bubble-menu">
            <BubbleMenuContent editor={editor} />
          </BubbleMenu>
        </>
      )}

      <div className="rte-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
