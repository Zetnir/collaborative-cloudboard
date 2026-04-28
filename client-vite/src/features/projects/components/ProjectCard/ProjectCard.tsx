import { useNavigate } from "react-router";
import { MouseEvent } from "react";

// assets
import cardImage from "../../../../assets/space-colors.jpeg";

// types
import { Project } from "../../types/project.types";

// icons
import { FaRegTrashAlt } from "react-icons/fa";

// styles
import "./ProjectCard.scss";

export interface ProjectCardProps {
  project: Project;
  onProjectDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onProjectDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigate(`/projects/${project.id}`);
  };

  const onDeleteClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onProjectDelete(project.id);
  };

  return (
    <div
      className="card project-card"
      style={{ width: "300px", height: "300px" }}
      onClick={onCardClick}
    >
      <div
        className="card-header position-absolute d-flex justify-content-end w-100"
        onClick={onDeleteClick}
      >
        <FaRegTrashAlt color="var(--color-error)" className="delete-icon" />
      </div>
      <img
        src={cardImage}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        alt="project Image"
      />
      <div className="card-body">
        <h5 className="ps-2 pb-2">{project.name}</h5>
        <div className="container row pe-0">
          <div className="col">
            <span className="badge bg-primary p-2">3 Lists</span>
          </div>
          <div className="col justify-content-end d-flex pe-0">
            <span className="card-date">{project.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
