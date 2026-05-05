import axiosInstance from "../../../api/axiosInstance";
import type { Task } from "../types/task.types";

export const tasksApi = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    const response = await axiosInstance.get<Task[]>("/tasks", {
      params: { project: projectId },
    });
    return response.data;
  },

  create: async (data: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    const response = await axiosInstance.post<Task>("/tasks", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Omit<Task, "id" | "createdAt">>,
  ): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  move: async (
    id: string,
    payload: { status: string; order: number },
  ): Promise<Task> => {
    const response = await axiosInstance.patch<Task>(
      `/tasks/${id}/move`,
      payload,
    );
    return response.data;
  },
};
