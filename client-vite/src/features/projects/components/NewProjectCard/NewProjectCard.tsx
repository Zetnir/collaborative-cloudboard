// icons
import { FaCirclePlus } from "react-icons/fa6";

// styles
import "./NewProjectCard.scss";

export const NewProjectCard = () => {
  return (
    <>
      <div
        className="card create-project-card d-flex align-items-center justify-content-center"
        style={{
          width: "300px",
          height: "300px",
          backgroundColor: "#f0f0f0",
          border: "2px dashed #ccc",
          cursor: "pointer",
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <FaCirclePlus size={35} className="icon mb-2" />
        <h4 className="text-muted">Create New project</h4>
      </div>
    </>
  );
};
