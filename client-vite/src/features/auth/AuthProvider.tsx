import { useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { AuthContext } from "./hooks/AuthContext";
import { authApi } from "./api/authApi";
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from "./utils/tokenUtils";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthState,
} from "./types/auth.types";
import { AxiosError } from "axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Schedule token refresh before expiration
  // const scheduleTokenRefresh = useCallback(
  //   (accessToken: string) => {
  //     // Clear any existing timeout
  //     if (refreshTimeout) {
  //       clearTimeout(refreshTimeout);
  //     }

  //     const timeUntilExpiry = getTimeUntilExpiration(accessToken);

  //     // Refresh 60 seconds before expiration
  //     const refreshTime = Math.max(0, timeUntilExpiry - 60000);

  //     if (refreshTime > 0) {
  //       const timeout = setTimeout(async () => {
  //         try {
  //           await refreshAuth();
  //         } catch (error) {
  //           console.error("Failed to refresh token:", error);
  //           logout();
  //         }
  //       }, refreshTime);

  //       setRefreshTimeout(timeout);
  //     }
  //   },
  //   [], // Empty dependency array - we'll access refreshTimeout directly
  // );

  // Refresh authentication
  const refreshAuth = useCallback(async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await authApi.refreshToken(refreshToken);
      setTokens(accessToken, newRefreshToken);

      const user = await authApi.getCurrentUser();

      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
        error: null,
      }));

      //scheduleTokenRefresh(accessToken);
    } catch (error) {
      clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });
      throw error;
    }
  }, []); // Empty dependency - scheduleTokenRefresh uses closure

  // Logout function
  const logout = useCallback((): void => {
    const refreshToken = getRefreshToken();

    // Clear timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      setRefreshTimeout(null);
    }

    // TODO : Invalidate refresh token on server (fire and forget)
    // Invalidate refresh token on server (fire and forget)
    if (refreshToken) {
      // authApi.logout(refreshToken).catch(console.error);
    }

    clearTokens();

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []); // Empty dependency - uses closure

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
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
          // scheduleTokenRefresh(accessToken);
        } else if (refreshToken) {
          // Access token expired but refresh token exists
          await refreshAuth();
          setState((prev) => ({ ...prev, isLoading: false }));
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

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
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

        // scheduleTokenRefresh(tokens.accessToken);
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

        //scheduleTokenRefresh(tokens.accessToken);
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

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshAuth,
      clearError,
    }),
    [state, login, register, logout, refreshAuth, clearError],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
