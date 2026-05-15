import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const submit = async () => {
    if (!username || !password) return setError("Заполните все поля");
    setLoading(true);
    setError("");
    try {
      const fn = mode === "login" ? authApi.login : authApi.register;
      const { data } = await fn(username, password);
      setAuth(
        data.token,
        data.user.username,
        data.user.id); // decode id from token in production
      navigate("/");
    } catch (e: any) {
      setError(e.response?.data?.error || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Zap size={20} className="text-accent" />
          </div>
          <span className="text-xl font-bold text-text tracking-wide uppercase">PC Builder</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h1 className="text-lg font-semibold text-text mb-6">
            {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
          </h1>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-subtle mb-1.5 block">Логин</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="username"
              />
            </div>
            <div>
              <label className="text-xs text-subtle mb-1.5 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-5 bg-accent hover:bg-accentDim text-white font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>

          <p className="mt-4 text-center text-xs text-subtle">
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-accent hover:underline"
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}