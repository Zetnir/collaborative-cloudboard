import cardImage from "../../../assets/space-colors.jpeg";
import "./BoardCard.scss";

export const BoardCard = () => {
  return (
    <div
      className="card board-card"
      style={{ width: "300px", height: "300px" }}
    >
      <img
        src={cardImage}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        alt="Board Image"
      />
      <div className="card-body">
        <h5 className="ps-2 pb-2">Board Title</h5>
        <div className="container row pe-0">
          <div className="col">
            <span className="badge bg-primary p-2">3 Lists</span>
          </div>
          <div className="col justify-content-end d-flex pe-0">
            <span className="card-date">Modified Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
