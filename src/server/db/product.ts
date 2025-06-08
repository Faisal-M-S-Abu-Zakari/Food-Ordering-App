import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSallers = cache(
  (limit?: number | undefined) => {
    const bestSallers = db.product.findMany({
      // here i add condition that return only products that have been ordered
      where: {
        orders: {
          // it means that at least one
          //   يعني هيرجع فقط المنتجات يلي تم شراءها فقط , حتى لو تم شراءها مرة وحدة
          some: {},
        },
      },
      //   here to return the product in desc order , the most orderd product at the first
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      include: {
        sizes: true,
        extras: true,
      },
      //   here to limit the render product on the app , E.X : i want to render 3 products only that have highest best seller
      take: limit,
    });
    return bestSallers;
  },
  //   so here it will cache according to this key , and will revalidate according to this key
  ["best-sellers"],
  //   3600 === 1 hour
  //   if you want to revalidate the cache before 1 hour ==> ctrl+shift+R
  { revalidate: 3600 }
);
