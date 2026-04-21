import { FC } from "react";

interface AuthToggleProps {
  isLogin: boolean;
  onChange: (isLogin: boolean) => void;
}

export const AuthToggle: FC<AuthToggleProps> = ({ isLogin, onChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          isLogin
            ? "bg-[#5D6AD1] text-white"
            : "bg-[#F1F3F9] text-[#64748B] hover:bg-[#E0E4F2]"
        }`}
      >
        Log In
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          !isLogin
            ? "bg-[#5D6AD1] text-white"
            : "bg-[#F1F3F9] text-[#64748B] hover:bg-[#E0E4F2]"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};
