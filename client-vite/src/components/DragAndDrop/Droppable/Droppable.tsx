import { useDroppable } from "@dnd-kit/react";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div ref={ref} style={{ width: 300, height: 300 }}>
      {children}
    </div>
  );
}

export default Droppable;
