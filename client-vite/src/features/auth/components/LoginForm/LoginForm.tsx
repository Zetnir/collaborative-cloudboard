import { ChangeEvent, SubmitEvent, FC, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LoginCredentials } from "../../types/auth.types";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  clearError: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  clearError,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="form-control"
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="position-relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="form-control pe-5"
              disabled={isLoading}
            />
            {formData?.password ? (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            ) : null}
          </div>
        </div>

        {error && <div className="alert alert-danger small mb-3">{error}</div>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-100"
      >
        {isLoading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};
