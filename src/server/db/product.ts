import { db } from "@/lib/prisma";

export const getBestSallers = async () => {
  const bestSallers = await db.product.findMany({
    include: {
      sizes: true,
      extras: true,
    },
  });
  return bestSallers;
};
