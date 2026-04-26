import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./App.scss";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute/ProtectedRoute";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import "react-toastify/dist/ReactToastify.css";
import { BoardDetails } from "./features/boards/BoardDetails/BoardDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <BoardDetails />
              </ProtectedRoute>
            }
          />

          {/* Error Route */}
          <Route path="/error" element={<ErrorPage />} />

          {/* Catch all - redirect to error page */}
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
