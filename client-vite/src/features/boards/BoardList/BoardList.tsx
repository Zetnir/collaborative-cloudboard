import { BoardCard } from "../BoardCard/BoardCard";
import "./BoardList.scss";
import { CreateBoardCard } from "../CreateBoardCard/CreateBoardCard";
import { Project, projectsApi } from "../../../api/projectsApi";
import { useEffect, useState } from "react";

export const BoardList = () => {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState<Project[]>([]);

  const fetchAllBoards = () => {
    setLoading(true);
    return projectsApi.getAll().then((data) => {
      setBoards(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const getAllBoards = async () => {
      await fetchAllBoards();
    };
    getAllBoards();
  }, []);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="board-list">
          <CreateBoardCard />
          {!loading &&
            boards.map((board) => <BoardCard key={board.id} board={board} />)}
        </div>
      </div>
    </div>
  );
};
