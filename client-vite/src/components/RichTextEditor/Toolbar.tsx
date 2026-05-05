import { Editor, useEditorState } from "@tiptap/react";

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

export function Toolbar({
  editor,
  onFileClick,
}: {
  editor: Editor;
  onFileClick?: () => void;
}) {
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
      editor.chain().focus().setHeading({ level: Number(value) as HeadingLevel }).run();
    }
  };

  return (
    <div className="rte-toolbar">
      <ToolbarBtn
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        icon="bi-arrow-counterclockwise"
        title="Undo"
      />
      <ToolbarBtn
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
        icon="bi-arrow-clockwise"
        title="Redo"
      />
      <Sep />

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
      {onFileClick && (
        <ToolbarBtn onClick={onFileClick} icon="bi-paperclip" title="Attach image" />
      )}

      <Sep />

      <ToolbarBtn active={state.isBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()} icon="bi-list-ul" title="Bullet list" />
      <ToolbarBtn active={state.isOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon="bi-list-ol" title="Ordered list" />

      <Sep />

      <ToolbarBtn active={state.isBlockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon="bi-blockquote-left" title="Quote" />
      <ToolbarBtn active={state.isCodeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()} icon="bi-code-square" title="Code block" />
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} icon="bi-hr" title="Horizontal rule" />

      <Sep />

      <ToolbarBtn active={state.isAlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()} icon="bi-text-left" title="Align left" />
      <ToolbarBtn active={state.isAlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()} icon="bi-text-center" title="Align center" />
      <ToolbarBtn active={state.isAlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()} icon="bi-text-right" title="Align right" />
    </div>
  );
}
