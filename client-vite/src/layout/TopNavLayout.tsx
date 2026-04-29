import { Outlet } from "react-router";
import { TopNav } from "../components/TopNav/TopNav";

export const TopNavLayout = () => (
  <>
    <TopNav />
    <Outlet />
  </>
);
