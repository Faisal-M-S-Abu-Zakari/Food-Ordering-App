import { Environments, Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "password", type: "password" },
      },
      authorize(credentials) {
        const user = credentials;
        return { id: crypto.randomUUID(), ...user };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};
