import { Request, Response } from "express";
import { Project } from "../models/Project.js";

interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
  access: "private" | "public";
  columns?: string[];
  workspace: string;
  coverImgUrl?: string | null;
  createdAt: Date;
}

const projectToDto = (project: any): ProjectDTO => {
  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    owner: project.owner.toString(),
    members: project.members.map((member: any) => member.toString()),
    access: project.access,
    columns: project.columns,
    workspace: project.workspace,
    coverImgUrl: project.coverImgUrl,
    createdAt: project.createdAt,
  };
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects.map(projectToDto));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(projectToDto(project));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project", error });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(projectToDto(project));
  } catch (error) {
    res.status(400).json({ message: "Failed to create project", error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  console.log("Updating project with data:", req.body);
  try {
    const { id } = req.params;
    const result = await Project.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });

    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(projectToDto(result));
  } catch (error) {
    res.status(400).json({ message: "Failed to update project", error });
  }
};

export const moveColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { columns } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: id },
      { columns },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(projectToDto(updatedProject));
  } catch (error) {
    return res.status(400).json({
      message: "Unable to move column",
      error,
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(204).send({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error });
  }
};
