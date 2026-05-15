import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md">
      <div className="mb-6">
        <p className="text-xs text-subtle uppercase tracking-wider mb-1">Аккаунт</p>
        <h1 className="text-2xl font-bold text-text">Профиль</h1>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <User size={24} className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-text text-lg">{username}</p>
            <p className="text-xs text-subtle">Пользователь PC Builder</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-400/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-400/10 transition-all"
        >
          <LogOut size={15} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}