import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./App.scss";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import "react-toastify/dist/ReactToastify.css";
import { ProjectDetails } from "./features/projects/components/ProjectDetails/ProjectDetails";
import { NavLayout } from "./layout/NavLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<NavLayout />}>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />} />

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
