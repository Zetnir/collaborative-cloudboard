import { useState, ReactNode, useCallback, useEffect, useMemo } from "react";

// api
import { authApi } from "./api/authApi";

// types
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthState,
} from "./types/auth.types";

// utils
import {
  setTokens,
  getAccessToken,
  clearTokens,
  isTokenExpired,
} from "./utils/tokenUtils";
import { AuthContext } from "./hooks/AuthContext";
import { AxiosError } from "axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        if (accessToken && !isTokenExpired(accessToken)) {
          // Valid access token exists
          const user = await authApi.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        clearTokens();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, []); // Only run once on mount to avoid infinite loops

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { user, tokens } = await authApi.login(credentials);
        setTokens(tokens.accessToken, tokens.refreshToken);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMessage =
          err.response?.data?.message || "Login failed. Please try again.";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [],
  );

  // Register function
  const register = useCallback(
    async (data: RegisterCredentials): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { user, tokens } = await authApi.register(data);
        setTokens(tokens.accessToken, tokens.refreshToken);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMessage =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [],
  );

  // Clear error
  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Logout function
  const logout = useCallback((): void => {
    clearTokens();

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
