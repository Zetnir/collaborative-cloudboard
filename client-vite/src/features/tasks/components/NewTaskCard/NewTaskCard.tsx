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
          width: "300px",
          height: "50px",
          backgroundColor: "#f0f0f0",
          border: "2px dashed #ccc",
          cursor: "pointer",
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <h4 className="text-muted col-10 text-center mb-0 ">
          <FaPlus className="me-2" />
          Create New Task
        </h4>
      </div>
    </>
  );
};
