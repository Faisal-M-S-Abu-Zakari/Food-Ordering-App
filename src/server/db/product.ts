import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSallers = cache(
  () => {
    const bestSallers = db.product.findMany({
      include: {
        sizes: true,
        extras: true,
      },
    });
    return bestSallers;
  },
  //   so here it will cache according to this key , and will revalidate according to this key
  ["best-sellers"],
  //   3600 === 1 hour
  { revalidate: 3600 }
);
