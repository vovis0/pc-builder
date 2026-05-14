import { prisma } from "../../db/prisma";

export const getComponents = async (req: any, res: any) => {
  const { category, socket, ramtype, formfactor } = req.query;

  const components = await prisma.components.findMany({
    where: {
      categories: category
        ? { name: category }
        : undefined,
    },
    include: {
      cpu_specs: true,
      gpu_specs: true,
      motherboard_specs: true,
      ram_specs: true,
      psu_specs: true,
      case_specs: true,
    },
  });

  res.json(components);
};