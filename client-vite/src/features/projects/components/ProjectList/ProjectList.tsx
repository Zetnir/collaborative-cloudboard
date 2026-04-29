import { useEffect, useState } from "react";

// api
import { projectsApi } from "../../api/projectsApi";

// components
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { NewProjectCard } from "../NewProjectCard/NewProjectCard";

// types
import { Project } from "../../types/project.types";

// style
import "./ProjectList.scss";
import { ProjectModal } from "../ProjectModal/ProjectModal";

export const ProjectList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

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
    const fetchAllProjects = async () => {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
      setLoading(false);
    };

    fetchAllProjects();
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
              />
            ))}
          <ProjectModal onProjectAdd={onProjectAdd} />
        </div>
      </div>
    </div>
  );
};
