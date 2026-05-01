import { FC, FormEvent, useState } from "react";

// types
import { RegisterCredentials } from "../../types/auth.types";

// icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// styles
import "./RegisterForm.scss";

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface RegisterFormData extends RegisterCredentials {
  confirmPassword: string;
}

export const RegisterForm: FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time password match validation
    if (name === "confirmPassword" || name === "password") {
      const pass = name === "password" ? value : formData.password;
      const confirm =
        name === "confirmPassword" ? value : formData.confirmPassword;
      if (confirm && pass !== confirm) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Need to separate confirmPassword from formData
    await onSubmit(formatCredentials(formData));
  };

  const formatCredentials = (data: RegisterFormData) => {
    return {
      username: data.username || "",
      email: data.email || "",
      password: data.password || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    } as RegisterCredentials;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-3">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="form-control"
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="form-control"
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="john_doe"
            required
            className="form-control"
            disabled={isLoading}
          />
        </div>
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
              className="form-control"
              disabled={isLoading}
            />
            {formData?.password ? (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"

                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            ) : null}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="position-relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="form-control"
              disabled={isLoading}
            />
            {formData?.confirmPassword ? (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"

                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </span>
            ) : null}
          </div>
        </div>

        {passwordError && (
          <div className="text-sm text-danger">{passwordError}</div>
        )}
        {error && <div className="text-sm text-danger">{error}</div>}
      </div>
      <button
        type="submit"
        disabled={isLoading || !!passwordError}
        className="btn btn-primary w-100"
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
};
