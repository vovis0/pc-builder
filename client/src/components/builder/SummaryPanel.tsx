import { useEffect } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { useAuthStore } from "../../store/auth.store";
import { buildsApi } from "../../api/builds.api";
import { SLOT_CATEGORY } from "../../types";
import { CheckCircle, AlertTriangle, XCircle, Zap, Save } from "lucide-react";
import { checkCompatibility } from "../../utils/compatibility";

export default function SummaryPanel() {
  const slots = useBuilderStore((s) => s.slots);
  const compatibility = useBuilderStore((s) => s.compatibility);
  const setCompatibility = useBuilderStore((s) => s.setCompatibility);
  const totalPrice = useBuilderStore((s) => s.totalPrice);
  const userId = useAuthStore((s) => s.userId);

  // Run compatibility check on slot changes
  useEffect(() => {
    const result = checkCompatibility({
      cpu: slots.cpu?.cpu_specs,
      gpu: slots.gpu?.gpu_specs,
      motherboard: slots.motherboard?.motherboard_specs,
      ram: slots.ram?.ram_specs,
      psu: slots.psu?.psu_specs,
      pcCase: slots.case?.case_specs,
      ssds: slots.ssd ? [slots.ssd.ssd_specs] : [],
      hdds: slots.hdd ? [slots.hdd.hdd_specs] : [],
    });
    setCompatibility(result);
  }, [slots]);

  const saveBuild = async () => {
    if (!userId) return;
    const components = Object.entries(slots).map(([slot, c]) => ({
      id: c!.id,
      type: SLOT_CATEGORY[slot as keyof typeof SLOT_CATEGORY],
    }));
    try {
      await buildsApi.create(userId, `Сборка ${new Date().toLocaleDateString("ru-RU")}`, components);
      alert("Сборка сохранена!");
    } catch {
      alert("Ошибка при сохранении");
    }
  };

  const filled = Object.keys(slots).length;
  const price = totalPrice();

  return (
    <aside className="w-72 shrink-0 bg-surface border-l border-border flex flex-col">
      <div className="p-5 border-b border-border">
        <h2 className="font-semibold text-text text-sm uppercase tracking-wider mb-4">
          Общая сводка
        </h2>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xs text-subtle mb-1">Итоговая цена</p>
          <p className="text-2xl font-bold text-text font-mono">
            {price > 0 ? price.toLocaleString("ru-RU") + " ₽" : "—"}
          </p>
        </div>

        {/* Power */}
        {compatibility && (
          <div className="flex items-center gap-2 py-2.5 px-3 bg-bg rounded-lg border border-border mb-3">
            <Zap size={14} className="text-accent" />
            <span className="text-xs text-subtle">Потребление</span>
            <span className="ml-auto text-xs font-mono font-semibold text-text">
              {compatibility.estimatedPower}W
            </span>
          </div>
        )}

        {/* Compatibility */}
        {compatibility && (
          <div className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium mb-4
            ${compatibility.compatible && compatibility.warnings.length === 0
              ? "bg-green-400/5 border-green-400/20 text-green-400"
              : compatibility.errors.length > 0
              ? "bg-red-400/5 border-red-400/20 text-red-400"
              : "bg-yellow-400/5 border-yellow-400/20 text-yellow-400"
            }`}>
            {compatibility.errors.length > 0 ? (
              <><XCircle size={14} /> Несовместимо</>
            ) : compatibility.warnings.length > 0 ? (
              <><AlertTriangle size={14} /> Есть предупреждения</>
            ) : (
              <><CheckCircle size={14} /> Совместимо</>
            )}
          </div>
        )}
      </div>

      {/* Errors/Warnings */}
      {compatibility && (compatibility.errors.length > 0 || compatibility.warnings.length > 0) && (
        <div className="p-4 border-b border-border space-y-2 max-h-48 overflow-y-auto">
          {compatibility.errors.map((e, i) => (
            <div key={i} className="flex gap-2 text-xs text-red-400 bg-red-400/5 rounded-lg p-2">
              <XCircle size={12} className="shrink-0 mt-0.5" />
              <span>{e}</span>
            </div>
          ))}
          {compatibility.warnings.map((w, i) => (
            <div key={i} className="flex gap-2 text-xs text-yellow-400 bg-yellow-400/5 rounded-lg p-2">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-bg rounded-lg p-3 border border-border">
            <p className="text-xs text-subtle mb-1">Компонентов</p>
            <p className="text-lg font-bold text-text font-mono">{filled}/8</p>
          </div>
          <div className="bg-bg rounded-lg p-3 border border-border">
            <p className="text-xs text-subtle mb-1">Статус</p>
            <p className="text-xs font-semibold text-accent mt-1">
              {filled === 0 ? "Пусто" : filled < 4 ? "В процессе" : "Готово"}
            </p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 mt-auto">
        <button
          onClick={saveBuild}
          disabled={filled === 0}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accentDim text-white font-semibold text-sm py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={15} />
          Сохранить сборку
        </button>
      </div>
    </aside>
  );
}