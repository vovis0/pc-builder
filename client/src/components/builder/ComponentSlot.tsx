import { Plus, X, RefreshCw } from "lucide-react";
import type { Component, SlotKey } from "../../types";
import { SLOT_LABELS } from "../../types";
import clsx from "clsx";

interface Props {
  slot: SlotKey;
  component?: Component;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ComponentSlot({ slot, component, onAdd, onRemove }: Props) {
  const label = SLOT_LABELS[slot];

  return (
    <div
      className={clsx(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        component
          ? "bg-surface border-border"
          : "bg-surface/50 border-border/50 border-dashed"
      )}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <span className="text-accent text-xs font-bold">{slot.toUpperCase().slice(0, 3)}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-subtle mb-0.5 uppercase tracking-wider">{label}</p>
        {component ? (
          <>
            <p className="text-sm font-medium text-text truncate">{component.name}</p>
            {component.price && (
              <p className="text-xs text-accent font-semibold mt-0.5">
                {Number(component.price).toLocaleString("ru-RU")} ₽
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted italic">Компонент не выбран</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {component ? (
          <>
            <button
              onClick={onAdd}
              className="p-1.5 text-subtle hover:text-accent transition-colors"
              title="Изменить"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={onRemove}
              className="p-1.5 text-subtle hover:text-red-400 transition-colors"
              title="Удалить"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-xs font-medium rounded-lg hover:bg-accent/20 transition-all"
          >
            <Plus size={12} />
            Добавить
          </button>
        )}
      </div>
    </div>
  );
}