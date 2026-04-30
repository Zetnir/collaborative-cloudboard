import { useEffect, useState } from "react";

// api
import { projectsApi } from "../../api/projectsApi";
import { usersApi } from "../../../../api/usersApi";

// components
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { NewProjectCard } from "../NewProjectCard/NewProjectCard";

// types
import { Project } from "../../types/project.types";
import { User } from "../../../auth/types/auth.types";

// style
import "./ProjectList.scss";
import { ProjectModal } from "../ProjectModal/ProjectModal";

export const ProjectList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const onProjectDelete = async (id: string) => {
    await projectsApi.delete(id);
    setProjects((prev) => {
      return prev.filter((project) => project.id !== id);
    });
  };

  const onProjectAdd = async (
    projectData: Omit<Project, "id" | "createdAt">,
  ) => {
    try {
      const newProject = await projectsApi.create(projectData);
      setProjects((prev) => [...prev, newProject]);
      if (newProject) return true;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [projectsData, usersData] = await Promise.all([
        projectsApi.getAll(),
        usersApi.getAll(),
      ]);
      setProjects(projectsData);
      setUsers(usersData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="mx-4 py-4">
      <div className="row justify-content-center">
        <div className="board-list">
          <NewProjectCard />
          {!loading &&
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectDelete={onProjectDelete}
                members={users.filter((u) => project.members.includes(u.id))}
              />
            ))}
          <ProjectModal onProjectAdd={onProjectAdd} />
        </div>
      </div>
    </div>
  );
};
