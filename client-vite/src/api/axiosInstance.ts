// src/api/axiosInstance.ts

import axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, isTokenExpired } from "../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Track if we're currently refreshing
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (
//   error: Error | null,
//   token: string | null = null,
// ): void => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

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

// TODO : Better handle 401 errors
// Response interceptor - handle token refresh on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // If error is not 401 or request has already been retried, reject
//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     // If we're already refreshing, queue this request
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       })
//         .then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return axiosInstance(originalRequest);
//         })
//         .catch((err) => Promise.reject(err));
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     const refreshToken = getRefreshToken();

//     if (!refreshToken) {
//       clearTokens();
//       return Promise.reject(error);
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//         refreshToken,
//       });

//       const { accessToken, refreshToken: newRefreshToken } = response.data;
//       setTokens(accessToken, newRefreshToken);

//       processQueue(null, accessToken);

//       originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//       return axiosInstance(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError as Error, null);
//       clearTokens();
//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   },
// );

export default axiosInstance;
