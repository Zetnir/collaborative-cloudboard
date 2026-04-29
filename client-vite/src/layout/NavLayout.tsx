import { Outlet } from "react-router";
import { TopNav } from "../components/TopNav/TopNav";
import { SidePanel } from "../components/SidePanel/SidePanel";

export const NavLayout = () => (
  <>
    <TopNav />
    <div className="d-flex flex-row">
      <SidePanel />
      <div className="col" style={{ paddingLeft: "260px" }}>
        <Outlet />
      </div>
    </div>
  </>
);
