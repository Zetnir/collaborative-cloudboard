import { useDroppable } from "@dnd-kit/react";

interface DroppableProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Droppable({ id, title, children }: DroppableProps) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div
      ref={ref}
      style={{
        width: 290,
        height: 600,
        borderRadius: "10px",
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 6px 5px rgba(0, 0, 0, 0.15)",
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

export default Droppable;
