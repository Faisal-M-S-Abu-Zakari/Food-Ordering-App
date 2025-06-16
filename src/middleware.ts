// important things about middleware :
// this is server file , will be execute before run the application
// so , this file must return middleware function , it should be named middelware
// هذه الفنكشن هيتعرف عليها النكست و يبدا يشغلها

import { NextRequest, NextResponse } from "next/server";

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
