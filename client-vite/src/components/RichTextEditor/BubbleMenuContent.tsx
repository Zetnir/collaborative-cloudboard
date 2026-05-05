import { Editor, useEditorState } from "@tiptap/react";

export function BubbleMenuContent({ editor }: { editor: Editor }) {
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
