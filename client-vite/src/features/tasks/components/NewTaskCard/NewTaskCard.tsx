// icons
import { FaPlus } from "react-icons/fa";

// styles
import "./NewTaskCard.scss";

export const NewTaskCard = () => {
  return (
    <>
      <div
        className="card create-project-card d-flex align-items-center justify-content-center"
        style={{
          width: "280px",
          height: "50px",
          backgroundColor: "var(--color-surface)",
          border: "2px dashed var(--color-outline)",
          cursor: "pointer",
        }}
        data-bs-toggle="modal"
        data-bs-target="#taskModal"
      >
        <span className="new-task-text col-10 text-center mb-0">
          <FaPlus className="me-2" color="var(--color-outline)" />
          Add task
        </span>
      </div>
    </>
  );
};
