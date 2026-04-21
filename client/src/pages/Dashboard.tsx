import { FC } from "react";
import { useAuth } from "../hooks/useAuth";

export const Dashboard: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F1F3F9] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#5D6AD1]">CloudBoard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-[#5D6AD1] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#5D6AD1] mb-4">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-[#64748B] mb-4">
            You are successfully logged in to CloudBoard.
          </p>
          <div className="bg-[#F1F3F9] rounded-lg p-4">
            <p className="text-sm text-[#64748B]">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm text-[#64748B]">
              <strong>Username:</strong> {user?.username}
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-[#5D6AD1] mb-4">Dashboard</h3>
          <p className="text-[#64748B]">
            Add your dashboard content here. This page is protected and only
            accessible to authenticated users.
          </p>
        </div>
      </div>
    </div>
  );
};
