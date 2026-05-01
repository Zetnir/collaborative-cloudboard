import { FaFolder } from "react-icons/fa";
import { NavLink } from "react-router";
import { RiSettings3Fill } from "react-icons/ri";
import "./SidePanel.scss";

export const SidePanel = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `side-nav-item${isActive ? " active" : ""}`;

  return (
    <div className="d-flex flex-column side-panel">
      <div className="d-flex flex-column flex-fill gap-4">
        <div className="d-flex flex-column mt-4">
          <button className="work-space">
            <div className="d-flex flex-row justify-content-center align-items-center w-100">
              <div className="col-2 me-4 ms-4 work-space-icon">
                <FaFolder size={20} color="var(--color-on-primary)" />
              </div>
              <div className="col-10 d-flex row">
                <h3 className="work-space-folder row">Personal</h3>
                <span className="work-space-title row">Cloud workspace</span>
              </div>
            </div>
          </button>
        </div>
        <div className="d-flex flex-column">
          <div className="nav-button-list">
            <NavLink to="/dashboard" className={navClass}>
              All Boards
            </NavLink>
            <NavLink to="/recent" className={navClass}>
              Recent project
            </NavLink>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-end">
        <NavLink to="/settings" className={navClass}>
          <RiSettings3Fill className="action-icon" size={22} />
          Settings
        </NavLink>
      </div>
    </div>
  );
};
