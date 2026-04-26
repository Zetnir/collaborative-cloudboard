// src/api/authApi.ts

import axiosInstance from "./axiosInstance";
import type { User } from "../features/auth/types/auth.types";

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },
};
