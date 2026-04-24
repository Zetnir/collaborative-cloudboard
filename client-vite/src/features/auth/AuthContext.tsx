import { createContext, useContext } from "react";
import type { AuthContextType } from "../../types/auth.types";

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  refreshAuth: async () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
