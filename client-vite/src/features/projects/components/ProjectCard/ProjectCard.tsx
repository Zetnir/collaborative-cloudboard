import { useNavigate } from "react-router";
import { MouseEvent } from "react";

// assets
import cardImage from "../../../../assets/space-colors.jpeg";

// types
import { Project } from "../../types/project.types";

// styles
import "./ProjectCard.scss";

export interface ProjectCardProps {
  project: Project;
  onProjectDelete: (id: string) => void;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="card project-card" onClick={onCardClick}>
      <img src={cardImage} className="card-img-top" alt="project Image" />
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
