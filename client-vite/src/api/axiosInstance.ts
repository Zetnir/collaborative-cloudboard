// src/api/axiosInstance.ts

import axios, { InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  isTokenExpired,
} from "../features/auth/utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - add auth token to requests
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
