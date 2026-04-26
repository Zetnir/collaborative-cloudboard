import { FC, useState } from "react";
import { useNavigate } from "react-router";

// Assets
import { FaCloud } from "react-icons/fa";

// Components
import { AuthToggle } from "../../features/auth/components/AuthToggle/AuthToggle";
import { LoginForm } from "../../features/auth/components/LoginForm/LoginForm";
import { RegisterForm } from "../../features/auth/components/RegisterForm/RegisterForm";
import { useAuth } from "../../features/auth/hooks/AuthContext";

export const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await login(credentials);
      navigate("/dashboard");
    } catch {
      // Error is already set in auth context and displayed in form
    }
  };

  const handleRegister = async (credentials: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await register(credentials);
      navigate("/dashboard");
    } catch {
      // Error is handled in hook and displayed in form
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right bottom, #F1F3F9, #E0E4F2)",
      }}
    >
      <div className="w-100" style={{ maxWidth: "28rem" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <FaCloud size={48} color="#5D6AD1" className="mb-2" />
          <h1 className="fs-1 fw-bold mb-2" style={{ color: "#5D6AD1" }}>
            CloudBoard
          </h1>
          <p className="text-muted fs-6">
            Organize your thoughts with your team
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded shadow-lg p-5">
          <AuthToggle isLogin={isLogin} onChange={setIsLogin} />

          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              clearError={clearError}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 text-center small text-muted">
          <p>
            By continuing, you agree to our
            {/* Ignore because no href is provided, no valid link */}
            {/* eslint-disable-next-line */}
            <a
              href="#"
              className="text-decoration-none"
              style={{ color: "#5D6AD1" }}
            >
              Terms of Service
            </a>{" "}
            and
            {/* Ignore because no href is provided, no valid link */}
            {/* eslint-disable-next-line */}
            <a
              href="#"
              className="text-decoration-none"
              style={{ color: "#5D6AD1" }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
