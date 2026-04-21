import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CloudIcon } from "../components/Auth/CloudIcon";
import { AuthToggle } from "../components/Auth/AuthToggle";
import { LoginForm } from "../components/Auth/LoginForm";
import { RegisterForm } from "../components/Auth/RegisterForm";

export const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await login(credentials);
      console.log("Login successful, navigating to dashboard...");
      navigate("/dashboard");
    } catch {
      // Error is handled in hook and displayed in form
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
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3F9] to-[#E0E4F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <CloudIcon />
          <h1 className="text-4xl font-bold text-[#5D6AD1] mb-2">CloudBoard</h1>
          <p className="text-[#64748B] text-lg">
            Organize your thoughts with your team
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AuthToggle isLogin={isLogin} onChange={setIsLogin} />

          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
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
        <div className="mt-8 text-center text-sm text-[#64748B]">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#5D6AD1] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#5D6AD1] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
