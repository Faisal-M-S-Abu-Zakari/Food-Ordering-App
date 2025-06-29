import { Environments, Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { login } from "./_actions/auth";
import { Locale } from "@/i18n.config";

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
      // now i will create server function (./_actions/auth) that will take credentials and locale , then make the validation
      // credentails will came from the page that i determine it down : signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
      authorize: async (credentials, request) => {
        // now i call the login function which is async , so i need to await it
        // the login function need locale , so you will think to use getCurrentLocale fn but the next auth and middleware files execute parallel so the "x-url" header will not be access here , then the solution that the authorize function can take another parameter request
        const currentUrl = request.headers?.referer; // this return "/en/auth/signin"
        const locale = currentUrl.split("/")[3] as Locale;
        const result = await login(credentials, locale);
        // then check the status and that user found then return the user
        // you have to know that authorize function return user or null , so here i return user
        if (result.status === 200 && result.user) {
          return result.user;
        } else {
          throw new Error(
            JSON.stringify({
              // this is the validation error
              validationError: result.error,
              // this is the DB error
              responseError: result.message,
            })
          );
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};
