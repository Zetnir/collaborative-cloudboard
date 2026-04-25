import { FC } from "react";

interface AuthToggleProps {
  isLogin: boolean;
  onChange: (isLogin: boolean) => void;
}

export const AuthToggle: FC<AuthToggleProps> = ({ isLogin, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-4">
      <button
        onClick={() => onChange(true)}
        className={`flex-fill fw-500 py-2 px-3 rounded border-0 ${
          isLogin ? "btn btn-primary" : "btn btn-light text-muted"
        }`}
      >
        Log In
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-fill fw-500 py-2 px-3 rounded border-0 ${
          !isLogin ? "btn btn-primary" : "btn btn-light text-muted"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};
