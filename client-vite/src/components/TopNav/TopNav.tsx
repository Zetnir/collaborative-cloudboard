import "./TopNav.scss";
import { LuSettings, LuBell } from "react-icons/lu";
export const TopNav = () => {
  return (
    <div className="d-flex flex-row p-3 top-nav sticky-top">
      <div className="left-side d-flex col justify-content-start gap-4">
        <button className="nav-button">
          <h2 className="home-title">CloudBoard</h2>
        </button>
        <button className="nav-button">
          <h3 className="navigation-title">All boards</h3>
        </button>
        <button className="nav-button">
          <h3 className="navigation-title">Recent</h3>
        </button>
      </div>
      <div className="right-side d-flex col justify-content-end align-items-center">
        {/*TODO <div className="search-bar">Search boards</div> */}
        <button className="action-button">
          <LuBell />
        </button>
        <button className="action-button">
          <LuSettings />
        </button>
        <button className="user-icon ms-2"> ?</button>
      </div>
    </div>
  );
};
