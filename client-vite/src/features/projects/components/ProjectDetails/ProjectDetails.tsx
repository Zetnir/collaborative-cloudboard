import { useNavigate, useParams } from "react-router";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";

// api
import { projectsApi } from "../../api/projectsApi";

// components
import { TaskBoard } from "../../../tasks/components/TaskBoard/TaskBoard";

// types
import { Project } from "../../types/project.types";

// styles
import "./ProjectDetails.scss";

export const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

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

      <div className="mb-2 pb-2">
        <TaskBoard projectId={id} />
      </div>
    </div>
  );
};
