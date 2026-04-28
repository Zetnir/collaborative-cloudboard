import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Token storage functions
export const setTokens = (accessToken: string, refreshToken: string): void => {
  // Store access token in memory or sessionStorage for better security
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  // Refresh token can be stored in localStorage for persistence
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Token validation functions
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Add a buffer of 30 seconds to account for clock skew
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime + 30;
};

export const getTokenExpirationTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.exp * 1000; // Convert to milliseconds
};

export const getTimeUntilExpiration = (token: string): number => {
  const expTime = getTokenExpirationTime(token);
  if (!expTime) return 0;
  return Math.max(0, expTime - Date.now());
};
