import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { componentsApi } from "../../api/components.api";
import type { Component, SlotKey } from "../../types";
import { SLOT_CATEGORY, SLOT_LABELS } from "../../types";
import { useBuilderStore } from "../../store/builder.store";

interface Props {
  slot: SlotKey;
  onClose: () => void;
}

export default function ComponentPicker({ slot, onClose }: Props) {
  const [components, setComponents] = useState<Component[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const setComponent = useBuilderStore((s) => s.setComponent);

  useEffect(() => {
    setLoading(true);
    componentsApi
      .getAll(SLOT_CATEGORY[slot])
      .then((r) => setComponents(r.data))
      .finally(() => setLoading(false));
  }, [slot]);

  const filtered = components.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pick = (c: Component) => {
    setComponent(slot, c);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Выбор: {SLOT_LABELS[slot]}</h2>
          <button onClick={onClose} className="text-subtle hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3 bg-bg border border-border rounded-lg px-3 py-2">
            <Search size={14} className="text-subtle" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="flex-1 bg-transparent text-sm text-text placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && (
            <p className="text-center text-subtle py-8 text-sm">Загрузка...</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-subtle py-8 text-sm">Ничего не найдено</p>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c)}
              className="w-full text-left flex items-center gap-4 p-3 rounded-xl bg-bg border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-accent transition-colors">
                  {c.name}
                </p>
                <p className="text-xs text-subtle mt-0.5 truncate">
                  {getSubtitle(c)}
                </p>
              </div>
              {c.price && (
                <span className="text-sm font-semibold text-accent shrink-0">
                  {Number(c.price).toLocaleString("ru-RU")} ₽
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSubtitle(c: Component): string {
  if (c.cpu_specs) {
    const s = c.cpu_specs;
    return [s.cores && `${s.cores} ядер`, s.socket, s.tdp && `${s.tdp}W TDP`]
      .filter(Boolean).join(" • ");
  }
  if (c.gpu_specs) return `TGP: ${c.gpu_specs.tgp ?? "?"}W`;
  if (c.ram_specs) {
    const s = c.ram_specs;
    return [s.totalCapacity, s.memoryType, s.frequency].filter(Boolean).join(" • ");
  }
  if (c.motherboard_specs) {
    const s = c.motherboard_specs;
    return [s.socket, s.chipset, s.formFactor].filter(Boolean).join(" • ");
  }
  if (c.psu_specs) {
    const s = c.psu_specs;
    return [s.power, s.certificate80Plus, s.modular ? "Modular" : "Non-modular"].filter(Boolean).join(" • ");
  }
  if (c.ssd_specs) return [c.ssd_specs.capacity, c.ssd_specs.formFactor].filter(Boolean).join(" • ");
  return "";
}