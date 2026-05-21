import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";

// api
import { projectsApi } from "../../features/projects/api/projectsApi";

// components
import { TaskBoard } from "../../features/tasks/components/TaskBoard/TaskBoard";

// types
import { Project } from "../../features/projects/types/project.types";

// styles
import "./ProjectDetails.scss";

export const ProjectDetails = () => {
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="project-container mx-4 py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {project?.name ?? "..."}
          </li>
        </ol>
      </nav>
      <h2 className="title">{project?.name}</h2>
      <div className="my-2 pb-2">
        <TaskBoard projectId={id} />
      </div>
    </div>
  );
};
