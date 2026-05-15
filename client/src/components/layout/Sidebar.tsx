import { NavLink, useNavigate } from "react-router-dom";
import { Cpu, BookMarked, User, LogOut, Zap } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import clsx from "clsx";

const links = [
  { to: "/", icon: Cpu, label: "Конфигуратор" },
  { to: "/builds", icon: BookMarked, label: "Мои сборки" },
  { to: "/profile", icon: User, label: "Профиль" },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const username = useAuthStore((s) => s.username);
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <Zap size={16} className="text-accent" />
        </div>
        <span className="font-bold text-text text-sm tracking-wider uppercase">
          PC Builder
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-subtle hover:bg-border hover:text-text"
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-bold uppercase">
            {username?.[0] ?? "?"}
          </div>
          <span className="text-sm text-text flex-1 truncate">{username}</span>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-subtle hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}