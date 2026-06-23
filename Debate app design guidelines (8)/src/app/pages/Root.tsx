import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import { BottomNav } from "../components/BottomNav";

export function Root() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pb-[72px]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
