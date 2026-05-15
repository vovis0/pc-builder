import { prisma } from "../../db/prisma";

export const createBuild = async (req: any, res: any) => {
  const { userId, name, components } = req.body;

  const build = await prisma.builds.create({
    
    data: {
      userId,
      name,
    },
  });

  for (const c of components) {
    await prisma.build_components.create({
      data: {
        buildId: build.id,
        componentId: c.id,
        type: c.type,
      },
    });
  }

  res.json(build);
};
export const getBuilds = async (req: any, res: any) => {
  const builds = await prisma.builds.findMany({
    where: { userId: req.userId },
    include: {
      build_components: {
        include: { components: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json(builds);
};