import { create } from "zustand";
import type { Component, SlotKey, CompatibilityResult } from "../types";

interface BuilderState {
  slots: Partial<Record<SlotKey, Component>>;
  compatibility: CompatibilityResult | null;
  pickerOpen: SlotKey | null;

  setComponent: (slot: SlotKey, component: Component) => void;
  removeComponent: (slot: SlotKey) => void;
  clearAll: () => void;
  openPicker: (slot: SlotKey) => void;
  closePicker: () => void;
  setCompatibility: (result: CompatibilityResult) => void;

  totalPrice: () => number;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  slots: {},
  compatibility: null,
  pickerOpen: null,

  setComponent: (slot, component) =>
    set((s) => ({ slots: { ...s.slots, [slot]: component } })),

  removeComponent: (slot) =>
    set((s) => {
      const next = { ...s.slots };
      delete next[slot];
      return { slots: next };
    }),

  clearAll: () => set({ slots: {}, compatibility: null }),

  openPicker: (slot) => set({ pickerOpen: slot }),
  closePicker: () => set({ pickerOpen: null }),

  setCompatibility: (result) => set({ compatibility: result }),

  totalPrice: () =>
    Object.values(get().slots).reduce(
      (sum, c) => sum + (c?.price ? Number(c.price) : 0),
      0
    ),
}));