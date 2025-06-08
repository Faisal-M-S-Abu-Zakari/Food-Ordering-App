import { Prisma } from "../../generated/prisma";

// this is custom type for product and it relationShip
// here this type will have product ,sizes and extras
export type productWithRelations = Prisma.ProductGetPayload<{
  include: {
    sizes: true;
    extras: true;
  };
}>;
