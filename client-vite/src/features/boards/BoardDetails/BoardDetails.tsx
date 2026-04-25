import { useNavigate, useParams } from "react-router";
import { BiArrowBack } from "react-icons/bi";

import "./BoardDetails.scss";
import { Project, projectsApi } from "../../../api/projectsApi";
import { useEffect, useState } from "react";
import { Draggable } from "../../../components/DragAndDrop/Draggable/Draggable";
import { DragDropProvider } from "@dnd-kit/react";
import Droppable from "../../../components/DragAndDrop/Droppable/Droppable";

export const BoardDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [parent, setParent] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>("");

  const fetchProjectDetails = (id: string) => {
    setLoading(true);
    return projectsApi.getById(id as string).then((data) => {
      setProject(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const getProjectDetails = async (id: string) => {
      await fetchProjectDetails(id);
    };
    getProjectDetails(id as string);
  }, [id]);

  return (
    <div className="container">
      <div className="container-lg py-5">
        {/* Header */}
        <div className="header d-flex align-items-center justify-content-between">
          <h1 className="title">CloudBoard</h1>
        </div>
      </div>

      <div className="mb-4">
        <span className="previous-btn" onClick={() => navigate(-1)}>
          <BiArrowBack size={20} className="me-1" />
          Previous
        </span>
      </div>

      {/* Board Details Content */}
      <div className="details-card">
        <div className="card-body">
          <h5 className="details-card-title">Board Details</h5>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="details-info-box">
              <p>
                <strong>Name:</strong> {project?.name}
              </p>
              <p>
                <strong>Description:</strong> {project?.description}
              </p>
              <p>
                <strong>Members:</strong> {project?.members?.join(", ")}
              </p>
              <p>
                <strong>Owner:</strong> {project?.owner}
              </p>
              <p>
                <strong>Created at:</strong> {project?.createdAt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="details-card mb-4">
        <div className="card-body">
          <h5 className="details-card-title">Kanban Board</h5>
          <div className="container">
            <div className="row">
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return;
                  const targetId = event.operation.target?.id as string;
                  setStatus(targetId);
                  setParent(targetId);
                }}
              >
                <Droppable id={"todo"} title="Todo">
                  {parent == null || parent === "todo" ? (
                    <Draggable id={"1"} status={status} />
                  ) : null}
                </Droppable>
                <Droppable id={"in-progress"} title="In Progress">
                  {parent === "in-progress" ? (
                    <Draggable id={"1"} status={status} />
                  ) : null}
                </Droppable>
                <Droppable id={"done"} title="Done">
                  {parent === "done" ? (
                    <Draggable id={"1"} status={status} />
                  ) : null}
                </Droppable>
                <Droppable id={"blocked"} title="Blocked">
                  {parent === "blocked" ? (
                    <Draggable id={"1"} status={status} />
                  ) : null}
                </Droppable>
              </DragDropProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
