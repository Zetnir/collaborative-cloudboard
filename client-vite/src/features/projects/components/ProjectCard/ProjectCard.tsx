import { useNavigate } from "react-router";
import { MouseEvent } from "react";
import { LuLock } from "react-icons/lu";

// assets
import defaultImage from "../../../../assets/space-colors.jpeg";

// types
import { Project } from "../../types/project.types";
import { User } from "../../../auth/types/auth.types";

// styles
import "./ProjectCard.scss";

export interface ProjectCardProps {
  project: Project;
  onProjectDelete: (id: string) => void;
  members: User[];
}

export const ProjectCard = ({ project, members }: ProjectCardProps) => {
  const navigate = useNavigate();

  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="card project-card" onClick={onCardClick}>
      <div className="card-img-wrapper">
        <img
          src={project?.coverImgUrl || defaultImage}
          className="card-img-top"
          alt="project Image"
        />
        {project.access === "private" && (
          <div className="card-private-badge">
            <LuLock size={11} />
            <span>Private</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h5 className="ps-2 pb-2">{project.name}</h5>
        <div className="container row pe-0">
          <div className="col-4 members-icons">
            {members.slice(0, 2).map((member) => (
              <div
                key={member.id}
                className="member-avatar"
                title={`${member.firstName} ${member.lastName}`}
              >
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.firstName} />
                ) : (
                  <span>
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </span>
                )}
              </div>
            ))}
            {members.length > 2 && (
              <div className="member-avatar member-avatar--overflow">
                <span>+{members.length - 3}</span>
              </div>
            )}
          </div>
          <div className="col-8 justify-content-end d-flex pe-0">
            <span className="card-date">
              Created :{" "}
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
