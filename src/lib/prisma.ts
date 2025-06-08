import { Environments } from "@/constants/enums";
import { PrismaClient } from "../../generated/prisma";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      // if you are on development enviroment ==> ["query", "error", "warn"]
      // if you are on production enviroment ==> ["error"]
      process.env.NODE_ENV === Environments.DEV
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// create variable to deal with DB using prisma , to generate prismaClient
// now , you have to detect if you in production or development enviroment
export const db = globalForPrisma.prisma ?? prismaClientSingleton();

//   then you have to ensure that you are on development enviroment to call the previous variable
if (process.env.NODE_ENV !== Environments.PROD) {
  globalForPrisma.prisma = db;
}

// يعني بكل اختصار
// DB logs must appear on development enviroment only
