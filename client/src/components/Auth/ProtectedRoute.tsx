import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to auth page...");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
