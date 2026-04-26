// src/api/authApi.ts

import axiosInstance from "../../../api/axiosInstance";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
} from "../types/auth.types";

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  register: async (data: RegisterCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post("/auth/logout", { refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await axiosInstance.post<RefreshResponse>(
      "/auth/refresh",
      {
        refreshToken,
      },
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  },

  // Password reset endpoints (optional, can be implemented later)
  //   requestPasswordReset: async (email: string): Promise<void> => {
  //     await axiosInstance.post("/auth/password/reset-request", { email });
  //   },

  //   resetPassword: async (token: string, newPassword: string): Promise<void> => {
  //     await axiosInstance.post("/auth/password/reset", {
  //       token,
  //       newPassword,
  //     });
  //   },
};
