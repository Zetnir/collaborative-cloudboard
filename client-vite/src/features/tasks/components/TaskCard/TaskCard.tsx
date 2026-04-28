import { useSortable } from "@dnd-kit/react/sortable";

import "./TaskCard.scss";

interface TaskCardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  column: string;
}

export function TaskCard({
  id,
  index,
  column,
  title,
  description,
}: TaskCardProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  return (
    <div className="task-card my-2" ref={ref} data-dragging={isDragging}>
      <div>
        <h4>{title}</h4>
      </div>
      <div>
        <span>{description}</span>
      </div>
    </div>
  );
}
