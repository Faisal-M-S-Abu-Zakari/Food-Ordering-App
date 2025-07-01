// important things about middleware :
// this is server file , will be execute before run the application
// so , this file must return middleware function , it should be named middelware
// هذه الفنكشن هيتعرف عليها النكست و يبدا يشغلها

import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, LanguageType, Locale } from "./i18n.config";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "./constants/enums";
import { redirect } from "next/navigation";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: LanguageType[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  let locale = "";

  try {
    locale = matchLocale(languages, locales, i18n.defaultLocale);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    locale = i18n.defaultLocale;
  }
  return locale;
}

// this function return true or false according to the user is authenticated or not
// it takes the middleware function , so the previous middleware function move it to be parameter in withAuth
// and it take also callBack function
export default withAuth(
  async function middleware(request: NextRequest) {
    // i declare new header , and the headers may change so the function must be async
    const requestHeaders = new Headers(request.headers);
    //   here when i call the "x-url" header in amy server component will return the url for the request , E.X : if i call the "x-url" header in home page will return the url for home page
    requestHeaders.set("x-url", request.url);
    // the return statment i change it to variable and put it here in the request headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    // redirect phase :
    const pathname = request.nextUrl.pathname;

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathname.startsWith(`/${locale}`)
    );
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      );
    }
    // to know if user logged in , check if there is token
    // and pass the request from the middleware to the token function
    // because the token is inside the request , so if i want to get them i should pass request
    const isAuth = await getToken({ req: request });
    // now , i should determine the pages which protected
    // and the pages start with Auth [login , signup]
    const currentLocale = request.url.split("/")[3] as Locale;
    // it will be true if you are in AuthPages
    const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
    const protectedPages = [Routes.PROFILE, Routes.ADMIN];
    // it will return true if you are in Protected Pages
    const isProtectedRoute = protectedPages.some((route) =>
      pathname.startsWith(`${currentLocale}/${route}`)
    );
    // now after i determine the auth and protected pages , i will make checks:
    // here i say that if user not isAuth (mean that he is not logged in , there is no token) and he is try to access protected pages so redirect it to login page
    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(
        // request.url ==> is the url that i exist in it and i want to change it
        // So , new URl take : 1- the new url , 2- the route that i exist in
        new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
      );
    }
    // here if user is loggedIn and try to access protected pages so redirect him to profile page
    // now after redirect the user to profile page , if he try to change the url to access signup page , it will redirect him to profile . Because when you login , the token will be found so you have to log out to access log in page for another time
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
      );
    }
    return response;
  },
  {
    callbacks: {
      // this function if it return true ==> means that you loggedIn
      // it depends on middleware function logic
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, ..etc
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
