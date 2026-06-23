import { Link, useLocation } from "react-router";
import { Home, Search, Plus, Trophy, User } from "lucide-react";

const TABS = [
  { path: "/", label: "ホーム", icon: Home, exact: true },
  { path: "/ranking", label: "ランキング", icon: Trophy, exact: false },
  { path: "/create", label: "作成", icon: Plus, exact: false },
  { path: "/profile", label: "マイページ", icon: User, exact: false },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch h-[56px] max-w-lg mx-auto">
        {TABS.map(({ path, label, icon: Icon, exact }) => {
          const active = isActive(path, exact);
          const isCreate = path === "/create";

          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] relative"
            >
              {isCreate ? (
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-primary shadow-sm"
                  style={{ boxShadow: "0 2px 8px rgba(0,122,255,0.35)" }}
                >
                  <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </span>
              ) : (
                <>
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
