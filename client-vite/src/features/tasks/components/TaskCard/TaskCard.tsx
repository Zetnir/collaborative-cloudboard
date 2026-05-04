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
import { FaRegClock } from "react-icons/fa6";

import "./TaskCard.scss";

interface TaskCardProps {
  task: Task;
  index: number;
  column: string;
  onShowCardDetails: (task: Task) => void;
}

export const TaskCard = ({
  task,
  index,
  column,
  onShowCardDetails,
}: TaskCardProps) => {
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
    switch (priority) {
      case "highest":
        return (
          <FiChevronsUp color="var(--color-danger)" size={18} strokeWidth={3} />
        );
      case "high":
        return (
          <FiChevronUp color="var(--color-danger)" size={18} strokeWidth={3} />
        );
      case "medium":
        return (
          <FiMinus color="var(--color-secondary)" size={18} strokeWidth={3} />
        );
      case "low":
        return (
          <FiChevronDown
            color="var(--color-primary)"
            size={18}
            strokeWidth={3}
          />
        );
      case "lowest":
        return (
          <FiChevronsDown
            color="var(--color-primary)"
            size={18}
            strokeWidth={3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="task-card card my-2"
      ref={ref}
      data-dragging={isDragging}
      data-bs-toggle="modal"
      data-bs-target="#taskDetails"
      onClick={() => onShowCardDetails(task)}
    >
      <div className="card-header pb-0">
        <h4 className="task-card-title">{task.title}</h4>
      </div>
      <div className="card-body py-0">
        {task.description && (
          <p className="task-card-desc text-muted small mb-0">
            {task.description}
          </p>
        )}
      </div>
      <div className="card-footer pt-0">
        <div className="d-flex flex-column">
          {task?.dueDate ? (
            <div className="d-flex flex-row">
              <span className="due-date align-items-center d-flex">
                <FaRegClock className="ms-1 me-2" />
                {new Date(task?.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          ) : null}

          <div className="d-flex flex-row">
            <div className="col-10">
              {getPriorityIcon(task?.priority || "")}
            </div>
            <div className="col-2">
              {" "}
              {task.assignee && assigneeUser && (
                <div className="d-flex justify-content-center">
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
      </div>
    </div>
  );
};
