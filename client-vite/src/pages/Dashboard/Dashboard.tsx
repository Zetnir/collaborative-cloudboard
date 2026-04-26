import { FC } from "react";
import { useAuth } from "../../features/auth/hooks/AuthContext";
import { useNavigate } from "react-router";
import "./Dashboard.scss";
import { BoardList } from "../../features/boards/BoardList/BoardList";
import { ToastContainer } from "react-toastify";
import { CreateBoardModal } from "../../features/boards/CreateBoardModal/CreateBoardModal";

export const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="dashboard-container">
      <div className="container-lg py-5">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">CloudBoard</h1>
          <button onClick={onLogout} className="btn btn-primary">
            Logout
          </button>
        </div>

        {/* Welcome Card */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Welcome, {user?.firstName}!</h2>
          <p className="dashboard-welcome-text">
            You are successfully logged in to CloudBoard.
          </p>
          <div className="dashboard-info-box">
            <p className="dashboard-info-text">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="dashboard-info-text">
              <strong>Username:</strong> {user?.username}
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Dashboard</h3>
          <p className="dashboard-content-text">
            Add your dashboard content here. This page is protected and only
            accessible to authenticated users.
          </p>
          <BoardList />
        </div>
      </div>

      <CreateBoardModal />
      <ToastContainer />
    </div>
  );
};
