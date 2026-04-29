// icons
import { FaCirclePlus } from "react-icons/fa6";

// styles
import "./NewProjectCard.scss";

export const NewProjectCard = () => {
  return (
    <>
      <div
        className="card create-project-card d-flex align-items-center justify-content-center"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <FaCirclePlus size={35} className="icon mb-2" />
        <h4 className="new-board-text">New Board</h4>
      </div>
    </>
  );
};
