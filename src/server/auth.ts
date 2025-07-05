import { Environments, Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { login } from "./_actions/auth";
import { Locale } from "@/i18n.config";
import { User, UserRole } from "../../generated/prisma";
import { JWT } from "next-auth/jwt";

// the default jwt doesn,t contain role , so i override it to include role
declare module "next-auth/jwt" {
  // here it will extend the user but i make it optional (Partial)
  interface JWT extends Partial<User> {
    // here the data that i need from User , not all the user only the data that i write it here
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

// in the session inside callbacks , it will make error if i didn't declare this
// because the user might be undefined , so i extend the session from the defaultSession and add user to it ==> to say that the session will has user
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  // the idea from it that user session must include role , to use it in middleware
  callbacks: {
    // the jwt is the first step before the session
    // now the JWT type doesn't contain role so i add it above
    jwt: async ({ token }): Promise<JWT> => {
      // fetch the user from db
      const dbUser = await db.user.findUnique({
        where: {
          email: token?.email,
        },
      });
      // if there is no user then return the default token
      if (!dbUser) {
        return token;
      }
      // if user exist then return user data
      // the data that i provide it here in jwt , will be in session
      // so , any user data that you will need must write it here first
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image,
        city: dbUser.city,
        country: dbUser.country,
        phone: dbUser.phone,
        postalCode: dbUser.postalCode,
        streetAddress: dbUser.streetAddress,
      };
    },
    // the token here is come from the jwt
    session: ({ session, token }) => {
      if (token) {
        // at the begining the session.user will have [email , image , name ]
        // so i add these data to session
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image as string;
        session.user.country = token.country as string;
        session.user.city = token.city as string;
        session.user.postalCode = token.postalCode as string;
        session.user.streetAddress = token.streetAddress as string;
        session.user.phone = token.phone as string;
      }
      // after i determine the session i will return it , and return the user
      return {
        // لو انا مش مسجل دخول هيرجع السيشن
        ...session,
        // لو مسجل دخول هيعمل اوفر رايد على اليوزر و يرجع الداتا يلي بداخله
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image,
        },
      };
    },
  },
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
