import "./TopNav.scss";
import { RiSettings3Fill } from "react-icons/ri";
import { FaBell } from "react-icons/fa6";
import { NavLink } from "react-router";
export const TopNav = () => {
  return (
    <div className="d-flex flex-row p-3 top-nav sticky-top">
      <div className="left-side d-flex col justify-content-start gap-4">
        <NavLink to="/dashboard" className="nav-button">
          <h2 className="home-title">CloudBoard</h2>
        </NavLink>
        <NavLink to="/dashboard" className="nav-button">
          <h3 className="navigation-title">Boards</h3>
        </NavLink>
        <NavLink to="/files" className="nav-button">
          <h3 className="navigation-title">Files</h3>
        </NavLink>
        <NavLink to="/teams" className="nav-button">
          <h3 className="navigation-title">Teams</h3>
        </NavLink>
      </div>
      <div className="right-side d-flex col justify-content-end align-items-center">
        {/*TODO <div className="search-bar">Search boards</div> */}
        <button className="action-button">
          <FaBell size={18} className="action-icon" />
        </button>
        <button className="action-button">
          <RiSettings3Fill className="action-icon" size={22} />
        </button>
        <button className="user-icon ms-2"> ?</button>
      </div>
    </div>
  );
};
