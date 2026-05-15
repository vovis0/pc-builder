import { useEffect, useState } from "react";
import { buildsApi } from "../api/builds.api";
import type { Build } from "../types";
import { BookMarked, Calendar } from "lucide-react";

export default function SavedBuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildsApi.getAll()
      .then((r) => setBuilds(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-subtle text-sm">
      Загрузка...
    </div>
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <p className="text-xs text-subtle uppercase tracking-wider mb-1">История</p>
        <h1 className="text-2xl font-bold text-text">Мои сборки</h1>
      </div>

      {builds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookMarked size={40} className="text-muted mb-3" />
          <p className="text-subtle text-sm">Нет сохранённых сборок</p>
          <p className="text-muted text-xs mt-1">Создайте сборку в конфигураторе</p>
        </div>
      ) : (
        <div className="space-y-3">
          {builds.map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text">Сборка #{b.id}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-subtle">
                    <Calendar size={11} />
                    {new Date(b.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </div>
                </div>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-lg">
                  {b.build_components?.length ?? 0} компонентов
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}