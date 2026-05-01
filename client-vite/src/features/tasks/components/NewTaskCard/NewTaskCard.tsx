import { FC } from "react";

// icons
import { FaPlus } from "react-icons/fa";

// styles
import "./NewTaskCard.scss";

export const NewTaskCard: FC = () => {
  return (
    <div
      className="card new-task-card create-project-card d-flex align-items-center justify-content-center"
      data-bs-toggle="modal"
      data-bs-target="#taskModal"
    >
      <span className="new-task-text col-10 text-center mb-0">
        <FaPlus className="me-2" color="var(--color-outline)" />
        Add task
      </span>
    </div>
  );
};
