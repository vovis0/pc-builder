export interface User {
  id: number;
  username: string;
}

export interface Component {
  id: number;
  name: string;
  price: number | null;
  imageUrls: string | null;
  categoryId: number;
  categories: { name: string };
  cpu_specs?: CpuSpecs | null;
  gpu_specs?: GpuSpecs | null;
  motherboard_specs?: MotherboardSpecs | null;
  ram_specs?: RamSpecs | null;
  psu_specs?: PsuSpecs | null;
  case_specs?: CaseSpecs | null;
  ssd_specs?: SsdSpecs | null;
  hdd_specs?: HddSpecs | null;
}

export interface CpuSpecs {
  cores?: number; threads?: number; socket?: string;
  baseClock?: number; boostClock?: number; tdp?: number;
}
export interface GpuSpecs { tgp?: number; caseType?: string; }
export interface MotherboardSpecs {
  socket?: string; chipset?: string; formFactor?: string;
  ramType?: string; ramSlots?: number; m2Slots?: number;
  sataPorts?: number; pcix16?: number;
}
export interface RamSpecs {
  moduleCount?: number; memoryType?: string;
  totalCapacity?: string; frequency?: string;
}
export interface PsuSpecs { power?: string; certificate80Plus?: string; modular?: boolean; }
export interface CaseSpecs { caseType?: string; }
export interface SsdSpecs { capacity?: string; formFactor?: string; }
export interface HddSpecs { capacityGb?: number; rpm?: number; }

export interface CompatibilityResult {
  compatible: boolean;
  errors: string[];
  warnings: string[];
  estimatedPower: number;
}

export type SlotKey = "cpu" | "gpu" | "motherboard" | "ram" | "psu" | "case" | "ssd" | "hdd";

export const SLOT_LABELS: Record<SlotKey, string> = {
  cpu: "Процессор",
  gpu: "Видеокарта",
  motherboard: "Материнская плата",
  ram: "Оперативная память",
  psu: "Блок питания",
  case: "Корпус",
  ssd: "SSD Накопитель",
  hdd: "HDD Накопитель",
};

export const SLOT_CATEGORY: Record<SlotKey, string> = {
  cpu: "CPU",
  gpu: "GPU",
  motherboard: "Motherboard",
  ram: "RAM",
  psu: "PSU",
  case: "Case",
  ssd: "SSD",
  hdd: "HDD",
};

export interface Build {
  id: number;
  userId: number;
  createdAt: string;
  build_components: { componentId: number; components: Component }[];
}