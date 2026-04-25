import { BoardCard } from "../BoardCard/BoardCard";
import "./BoardList.scss";
import { CreateBoardCard } from "../CreateBoardCard/CreateBoardCard";

export const BoardList = () => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="board-list">
          <CreateBoardCard />
          <BoardCard />
          <BoardCard />
          <BoardCard />
          <BoardCard />
          <BoardCard />
          <BoardCard />
        </div>
      </div>
    </div>
  );
};
