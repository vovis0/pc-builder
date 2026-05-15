import { useBuilderStore } from "../store/builder.store";
import type { SlotKey } from "../types";
import ComponentSlot from "../components/builder/ComponentSlot";
import ComponentPicker from "../components/builder/ComponentPicker";
import SummaryPanel from "../components/builder/SummaryPanel";
import { Trash2 } from "lucide-react";

const SLOTS: SlotKey[] = ["cpu", "gpu", "motherboard", "ram", "psu", "case", "ssd", "hdd"];

export default function BuilderPage() {
  const { slots, pickerOpen, openPicker, closePicker, removeComponent, clearAll } =
    useBuilderStore();

  return (
    <div className="flex h-full">
      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-subtle uppercase tracking-wider mb-1">Конфигуратор</p>
            <h1 className="text-2xl font-bold text-text">Текущая сборка</h1>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm text-subtle border border-border rounded-lg hover:text-red-400 hover:border-red-400/40 transition-all"
          >
            <Trash2 size={14} />
            Очистить
          </button>
        </div>

        {/* Slots */}
        <div className="space-y-2">
          <p className="text-xs text-subtle uppercase tracking-wider mb-3">
            Компоненты •{" "}
            <span className="text-text">{Object.keys(slots).length}</span> из {SLOTS.length} выбрано
          </p>
          {SLOTS.map((slot) => (
            <ComponentSlot
              key={slot}
              slot={slot}
              component={slots[slot]}
              onAdd={() => openPicker(slot)}
              onRemove={() => removeComponent(slot)}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <SummaryPanel />

      {/* Picker modal */}
      {pickerOpen && (
        <ComponentPicker slot={pickerOpen} onClose={closePicker} />
      )}
    </div>
  );
}