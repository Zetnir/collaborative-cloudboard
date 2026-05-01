import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Task } from "../../types/task.types";
import { User } from "../../../auth/types/auth.types";
import { usersApi } from "../../../../api/usersApi";

import {
  FiChevronDown,
  FiChevronsDown,
  FiChevronsUp,
  FiChevronUp,
  FiMinus,
} from "react-icons/fi";

import "./TaskCard.scss";

interface TaskCardProps {
  task: Task;
  index: number;
  column: string;
}

export const TaskCard = ({ task, index, column }: TaskCardProps) => {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  const [assigneeUser, setAssigneeUser] = useState<User | null>(null);

  useEffect(() => {
    if (!task.assignee) return;
    let cancelled = false;
    usersApi
      .getById(task.assignee)
      .then((user) => {
        if (!cancelled) setAssigneeUser(user);
      })
      .catch(() => {
        if (!cancelled) setAssigneeUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [task.assignee]);

  const getPriorityIcon = (priority: string) => {
    console.log("priority", priority);
    console.log(task);
    switch (priority) {
      case "highest":
        return <FiChevronsUp color="var(--color-danger)" size={20} />;
      case "high":
        return <FiChevronUp color="var(--color-danger)" size={20} />;
      case "medium":
        return <FiMinus color="var(--color-secondary)" size={20} />;
      case "low":
        return <FiChevronDown color="var(--color-primary)" size={20} />;
      case "lowest":
        return <FiChevronsDown color="var(--color-primary)" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="task-card my-2 p-3" ref={ref} data-dragging={isDragging}>
      <h4 className="task-card__title">
        {task.title} {getPriorityIcon(task?.priority || "")}
      </h4>
      {task.description && (
        <p className="task-card__description text-muted small mb-0">
          {task.description}
        </p>
      )}
      <div className="d-flex flex-row">
        <div className="col-10"></div>
        <div className="col-2">
          {task.assignee && assigneeUser && (
            <div className="mt-2">
              <div
                className="member-avatar"
                title={`${assigneeUser.firstName} ${assigneeUser.lastName}`}
              >
                {assigneeUser.avatarUrl ? (
                  <img
                    src={assigneeUser.avatarUrl}
                    alt={assigneeUser.firstName}
                  />
                ) : (
                  <span>
                    {assigneeUser.firstName[0]}
                    {assigneeUser.lastName[0]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
