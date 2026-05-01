import { FC } from "react";
import { ProjectList } from "../../features/projects/components/ProjectList/ProjectList";
import { ToastContainer } from "react-toastify";
import "./Dashboard.scss";

export const Dashboard: FC = () => {
  return (
    <div className="dashboard-container mx-4 py-4">
      {/* Dashboard Content */}
      <div>
        <h1 className="dashboard-title">All Boards</h1>
        <p className="dashboard-content">
          Organize your thoughts and collaborate seamlessly
        </p>
        <ProjectList />
      </div>

      <ToastContainer />
    </div>
  );
};
