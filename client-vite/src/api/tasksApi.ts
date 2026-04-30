import axiosInstance from "./axiosInstance";
import { Task } from "../features/tasks/types/task.types";

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const { data } = await axiosInstance.get<Task[]>("/tasks", {
    params: { project: projectId },
  });
  return data;
};

export const createTask = async (
  taskData: Omit<Task, "id" | "createdAt">,
): Promise<Task> => {
  const { data } = await axiosInstance.post<Task>("/tasks", taskData);
  return data;
};
