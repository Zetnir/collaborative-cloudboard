import { useSortable } from "@dnd-kit/react/sortable";
import { Task } from "../../types/task.types";

import "./TaskCard.scss";

interface TaskCardProps {
  task: Task;
  index: number;
  column: string;
}

export function TaskCard({ task, index, column }: TaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  return (
    <div className="task-card my-2 p-3" ref={ref} data-dragging={isDragging}>
      <h4 className="task-card__title">{task.title}</h4>
      {task.description && (
        <p className="task-card__description text-muted small mb-0">
          {task.description}
        </p>
      )}
      {task.assignee && (
        <div className="task-card__assignee mt-2">
          <span className="badge bg-secondary">{task.assignee.slice(-6)}</span>
        </div>
      )}
    </div>
  );
}
