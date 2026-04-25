import { FaCirclePlus } from "react-icons/fa6";
import "./CreateBoardCard.scss";

import { CreateBoardModal } from "../CreateBoardModal/CreateBoardModal";

export const CreateBoardCard = () => {
  return (
    <>
      <div
        className="card create-board-card d-flex align-items-center justify-content-center"
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
        <h4 className="text-muted">Create New Board</h4>
      </div>
      <CreateBoardModal />
    </>
  );
};
