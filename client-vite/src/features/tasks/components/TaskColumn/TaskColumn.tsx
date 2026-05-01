import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { BsThreeDots } from "react-icons/bs";

import "./TaskColumn.scss";

interface TaskColumnProps {
  children: React.ReactNode;
  id: string;
  index: number;
  title: string;
}

export const TaskColumn = ({ children, id, index, title }: TaskColumnProps) => {
  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });
  return (
    <div
      className="task-column p-2 mx-2 d-flex justify-content-start align-items-center flex-column"
      ref={ref}
    >
      <div className="mb-2 d-flex row w-100">
        <div ref={handleRef} className="col-10 justify-content-start">
          <h4 className="text-left">{title}</h4>
        </div>
        <div className="col-2 d-flex justify-content-end">
          <button>
            <BsThreeDots />
          </button>
        </div>
      </div>
      <div className="d-flex flex-column gap-2">{children}</div>
    </div>
  );
};
