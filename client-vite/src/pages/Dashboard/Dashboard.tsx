import { FC } from "react";
import "./Dashboard.scss";
import { ProjectList } from "../../features/projects/components/ProjectList/ProjectList";
import { ToastContainer } from "react-toastify";

export const Dashboard: FC = () => {
  return (
    <div className="dashboard-container">
      <div className="mx-4 py-4">
        {/* Dashboard Content */}
        <div>
          <h1 className="dashboard-title">All Boards</h1>
          <p className="dashboard-content">
            Organize your thoughts and collaborate seamlessly
          </p>
          <ProjectList />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
