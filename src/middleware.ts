// important things about middleware :
// this is server file , will be execute before run the application
// so , this file must return middleware function , it should be named middelware
// هذه الفنكشن هيتعرف عليها النكست و يبدا يشغلها

import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, LanguageType, Locale } from "./i18n.config";

// this function must get the current locale , E.X : en or ar
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

// this function will has request , so it will return response
// request will contain searchparams and headers , searchparams may carry en or ar lang
// and these headers you can pass them to the response
// as example to determine arabic or english from header
export const middleware = async (request: NextRequest) => {
  // i declare new header , and the headers may change so the function must be async
  const requestHeaders = new Headers(request.headers);
  //   here when i call the "x-url" header in amy server component will return the url for the request , E.X : if i call the "x-url" header in home page will return the url for home page
  requestHeaders.set("x-url", request.url);
  return NextResponse.next({
    // then i pass the request headers
    // so the request will carry group of headers (requestHeaders)
    request: {
      headers: requestHeaders,
    },
  });
};

// this config will match the route that you will mainpulate with it in middleware function
export const config = {
  // Matcher ignoring `/_next/`, `/api/`, ..etc
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
