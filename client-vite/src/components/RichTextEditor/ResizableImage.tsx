import { useRef } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";

function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, title, width } = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width: number | null;
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  const onResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = wrapperRef.current?.offsetWidth ?? width ?? 200;

    const onMouseMove = (ev: MouseEvent) => {
      updateAttributes({ width: Math.max(50, Math.round(startWidth + (ev.clientX - startX))) });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <NodeViewWrapper>
      <div
        ref={wrapperRef}
        className={`rte-image-wrapper${selected ? " is-selected" : ""}`}
        style={{ width: width != null ? `${width}px` : undefined }}
      >
        <img src={src} alt={alt ?? ""} title={title} draggable={false} />
        {selected && (
          <div>
            <div className="rte-image-resize-handle-bottom-right" onMouseDown={onResizeStart} />
            <div className="rte-image-resize-handle-top-right" onMouseDown={onResizeStart} />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: null,
        renderHTML: (attrs: { width: number | null }) =>
          attrs.width != null ? { width: String(attrs.width) } : {},
        parseHTML: (el: HTMLElement) => {
          const w = el.getAttribute("width");
          return w ? Number(w) : null;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
