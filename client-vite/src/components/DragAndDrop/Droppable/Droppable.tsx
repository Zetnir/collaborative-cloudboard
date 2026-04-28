import { useDroppable } from "@dnd-kit/react";

interface DroppableProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Droppable({ id, title, children }: DroppableProps) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div
      ref={ref}
      style={{
        width: 300,
        height: 600,
        border: "1px solid var(--color-primary)",
        borderRadius: "20px",
      }}
      className="m-2 container"
    >
      <div className="row p-2">
        <h5>{title}</h5>
      </div>
      <div className="row p-2">{children}</div>
    </div>
  );
}
