// src/api/authApi.ts

import axiosInstance from "../../../api/axiosInstance";
import { Project } from "../types/project.types";

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await axiosInstance.get<Project[]>("/projects");
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await axiosInstance.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: Omit<Project, "id" | "createdAt">): Promise<Project> => {
    const response = await axiosInstance.post<Project>("/projects", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Omit<Project, "id" | "createdAt">>,
  ): Promise<Project> => {
    const response = await axiosInstance.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`);
  },
};
