const formFactorRank: Record<string, number> = {
  "mini-ITX": 1,
  "mITX": 1,

  "mATX": 2,
  "Micro-ATX": 2,

  "ATX": 3,

  "E-ATX": 4,
  "SSI-CEB": 5,
  "SSI-EEB": 6
};

const normalizeFormFactor = (value?: string | null) => {
  if (!value) return null;

  return value
    .trim()
    .replace("_", "-")
    .replace("micro-atx", "mATX")
    .replace("mini-itx", "mini-ITX")
    .toUpperCase()
    .replace("MATX", "mATX")
    .replace("MINI-ITX", "mini-ITX");
};

const parsePsuPower = (power?: string | null) => {
  if (!power) return 0;

  const match = power.match(/\d+/);

  return match ? Number(match[0]) : 0;
};

export const checkCompatibility = ({
  cpu,
  gpu,
  motherboard,
  ram,
  psu,
  pcCase,
  ssds = [],
  hdds = []
}: any) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  /*
    ==========================================
    CPU ↔ MOTHERBOARD
    ==========================================
  */

  if (cpu && motherboard) {
    if (
      cpu.socket &&
      motherboard.socket &&
      cpu.socket !== motherboard.socket
    ) {
      errors.push(
        `CPU socket ${cpu.socket} incompatible with motherboard socket ${motherboard.socket}`
      );
    }
  }

  /*
    ==========================================
    RAM ↔ MOTHERBOARD
    ==========================================
  */

  if (ram && motherboard) {
    if (
      ram.memorytype &&
      motherboard.ramtype &&
      ram.memorytype !== motherboard.ramtype
    ) {
      errors.push(
        `RAM type ${ram.memorytype} incompatible with motherboard ${motherboard.ramtype}`
      );
    }
  }

  /*
    ==========================================
    RAM SLOTS
    ==========================================
  */

  if (ram && motherboard) {
    if (
      ram.modulecount &&
      motherboard.ramslots &&
      ram.modulecount > motherboard.ramslots
    ) {
      errors.push(
        `Not enough RAM slots (${motherboard.ramslots}) for ${ram.modulecount} RAM modules`
      );
    }
  }

  /*
    ==========================================
    STORAGE SLOTS
    ==========================================
  */

  const totalSsdCount = ssds.length;
  const totalHddCount = hdds.length;

  const m2Ssds = ssds.filter(
    (s: any) =>
      s.formfactor &&
      s.formfactor.toLowerCase().includes("m.2")
  );

  const sataSsds = ssds.filter(
    (s: any) =>
      !s.formfactor ||
      !s.formfactor.toLowerCase().includes("m.2")
  );

  if (motherboard) {
    /*
      M2
    */

    if (
      motherboard.m2slots !== null &&
      motherboard.m2slots !== undefined
    ) {
      if (m2Ssds.length > motherboard.m2slots) {
        errors.push(
          `Motherboard has only ${motherboard.m2slots} M.2 slots`
        );
      }
    }

    /*
      SATA
    */

    const sataDevices = sataSsds.length + totalHddCount;

    if (
      motherboard.sataports !== null &&
      motherboard.sataports !== undefined
    ) {
      if (sataDevices > motherboard.sataports) {
        errors.push(
          `Motherboard has only ${motherboard.sataports} SATA ports`
        );
      }
    }
  }

  /*
    ==========================================
    MOTHERBOARD ↔ CASE
    ==========================================
  */

  if (motherboard && pcCase) {
    const mbFactor = normalizeFormFactor(
      motherboard.formfactor
    );

    const caseFactor = normalizeFormFactor(
      pcCase.casetype
    );

    if (
      mbFactor &&
      caseFactor &&
      formFactorRank[caseFactor] <
        formFactorRank[mbFactor]
    ) {
      errors.push(
        `Motherboard form factor ${mbFactor} does not fit case ${caseFactor}`
      );
    }
  }

  /*
    ==========================================
    GPU ↔ CASE
    ==========================================
  */

  if (gpu && pcCase) {
    const gpuCaseType = normalizeFormFactor(
      gpu.casetype
    );

    const caseFactor =


normalizeFormFactor(
      pcCase.casetype
    );

    if (
      gpuCaseType &&
      caseFactor &&
      formFactorRank[caseFactor] <
        formFactorRank[gpuCaseType]
    ) {
      errors.push(
        `GPU requires at least ${gpuCaseType} case`
      );
    }
  }

  /*
    ==========================================
    PSU POWER
    ==========================================
  */

  let estimatedPower = 0;

  if (cpu?.tdp)
    estimatedPower += Number(cpu.tdp);

  if (gpu?.tgp)
    estimatedPower += Number(gpu.tgp);

  /*
    SSD/HDD estimation
  */

  estimatedPower += totalSsdCount * 8;
  estimatedPower += totalHddCount * 12;

  /*
    RAM estimation
  */

  if (ram?.modulecount)
    estimatedPower += ram.modulecount * 5;

  /*
    Motherboard baseline
  */

  if (motherboard)
    estimatedPower += 50;

  /*
    PSU validation
  */

  if (psu) {
    const psuPower = parsePsuPower(psu.power);

    /*
      +20% headroom
    */

    const recommendedPower = Math.ceil(
      estimatedPower * 1.2
    );

    if (psuPower < recommendedPower) {
      errors.push(
        `PSU wattage too low. Recommended: ${recommendedPower}W`
      );
    }

    /*
      warning zone
    */

    if (
      psuPower >= recommendedPower &&
      psuPower < recommendedPower + 100
    ) {
      warnings.push(
        `PSU has little upgrade headroom`
      );
    }
  }

  /*
    ==========================================
    PCI-E CHECK
    ==========================================
  */

  if (gpu && motherboard) {
    if (
      motherboard.pcix16 !== null &&
      motherboard.pcix16 !== undefined &&
      motherboard.pcix16 < 1
    ) {
      errors.push(
        `Motherboard has no PCI-E x16 slot for GPU`
      );
    }
  }

  /*
    ==========================================
    RESULT
    ==========================================
  */

  return {
    compatible: errors.length === 0,

    errors,

    warnings,

    estimatedPower
  };
};