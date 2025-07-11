import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getProductsByCategory = cache(
  () => {
    const categories = db.category.findMany({
      include: {
        products: {
          include: {
            sizes: true,
            extras: true,
          },
        },
      },
    });
    return categories;
  },
  ["products-by-category "],
  { revalidate: 3600 }
);

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

// هاد الفنكشن استخدمتها في صفحة المينيو تبعت الادمن لحتى يرجع كل المنتجات
export const getProducts = cache(
  () => {
    const products = db.product.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return products;
  },
  ["products"],
  { revalidate: 3600 }
);
// هاد الفنكشن عشان توصل للمنتج بناء على الاي دي و تعمل عليه التعديلات
export const getProduct = cache(
  (id: string) => {
    const product = db.product.findUnique({
      where: {
        id,
      },
      include: {
        sizes: true,
        extras: true,
      },
    });
    return product;
  },
  [`product-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);
